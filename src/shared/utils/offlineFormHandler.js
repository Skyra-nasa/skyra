import { dbManager } from '../storage/indexedDB.js';
import { pushNotificationService } from './pushNotifications.js';

class OfflineFormHandler {
  constructor() {
    this.isOnline = navigator.onLine;
    this.syncInProgress = false;
    this.initializeEventListeners();
  }

  initializeEventListeners() {
    // Listen for online/offline events
    window.addEventListener('online', this.handleOnline.bind(this));
    window.addEventListener('offline', this.handleOffline.bind(this));
    
    // Listen for service worker messages
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.addEventListener('message', this.handleSWMessage.bind(this));
    }
  }

  handleOnline() {
    console.log('Connection restored - starting sync');
    this.isOnline = true;
    this.syncOfflineData();
  }

  handleOffline() {
    console.log('Connection lost - switching to offline mode');
    this.isOnline = false;
  }

  handleSWMessage(event) {
    if (event.data && event.data.type === 'BACKGROUND_SYNC_SUCCESS') {
      console.log('Background sync completed successfully');
      this.showSyncSuccessNotification(event.data.count);
    }
  }

  // Main form submission handler
  async submitForm(formData, options = {}) {
    const submissionData = {
      data: formData,
      url: options.url || '/api/submit',
      method: options.method || 'POST',
      headers: options.headers || { 'Content-Type': 'application/json' },
      type: options.type || 'general',
      timestamp: new Date().toISOString(),
      retryCount: 0,
      maxRetries: options.maxRetries || 3
    };

    try {
      if (this.isOnline) {
        // Try to submit online first
        const response = await this.submitOnline(submissionData);
        
        if (response.ok) {
          console.log('Form submitted successfully online');
          return {
            success: true,
            online: true,
            response: await response.json()
          };
        } else {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
      } else {
        throw new Error('No network connection');
      }
    } catch (error) {
      console.log('Online submission failed, storing offline:', error.message);
      
      // Store for offline submission
      const offlineId = await this.storeOffline(submissionData);
      
      // Register for background sync if supported
      await this.registerBackgroundSync();
      
      // Show user feedback
      this.showOfflineNotification();
      
      return {
        success: true,
        online: false,
        offlineId,
        message: 'Form saved offline. Will sync when connection is restored.'
      };
    }
  }

  // Submit form data online
  async submitOnline(submissionData) {
    const { url, method, headers, data } = submissionData;
    
    return fetch(url, {
      method,
      headers,
      body: JSON.stringify(data)
    });
  }

  // Store form data for offline submission
  async storeOffline(submissionData) {
    try {
      const offlineId = await dbManager.saveFormSubmission(submissionData);
      console.log('Form data stored offline with ID:', offlineId);
      return offlineId;
    } catch (error) {
      console.error('Failed to store form offline:', error);
      throw new Error('Failed to save form data offline');
    }
  }

  // Register background sync for when connection returns
  async registerBackgroundSync() {
    try {
      if ('serviceWorker' in navigator && 'sync' in window.ServiceWorkerRegistration.prototype) {
        const registration = await navigator.serviceWorker.ready;
        await registration.sync.register('skyra-background-sync');
        console.log('Background sync registered');
        return true;
      } else {
        console.log('Background sync not supported, will use online event');
        return false;
      }
    } catch (error) {
      console.error('Failed to register background sync:', error);
      return false;
    }
  }

  // Sync all offline data when connection is restored
  async syncOfflineData() {
    if (this.syncInProgress) {
      console.log('Sync already in progress, skipping');
      return;
    }

    this.syncInProgress = true;
    let syncedCount = 0;
    let failedCount = 0;

    try {
      console.log('Starting offline data sync');
      
      // Get all unsynced form submissions
      const offlineSubmissions = await dbManager.getFormSubmissions(false);
      console.log(`Found ${offlineSubmissions.length} offline submissions to sync`);

      if (offlineSubmissions.length === 0) {
        console.log('No offline data to sync');
        return;
      }

      // Process each submission
      for (const submission of offlineSubmissions) {
        try {
          console.log(`Syncing submission ${submission.id}`);
          
          const response = await this.submitOnline(submission);
          
          if (response.ok) {
            // Mark as synced in database
            await dbManager.markSubmissionSynced(submission.id);
            syncedCount++;
            console.log(`Successfully synced submission ${submission.id}`);
          } else {
            // Increment retry count
            await this.handleSyncFailure(submission);
            failedCount++;
          }
        } catch (error) {
          console.error(`Failed to sync submission ${submission.id}:`, error);
          await this.handleSyncFailure(submission);
          failedCount++;
        }
      }

      // Show sync results
      if (syncedCount > 0) {
        this.showSyncSuccessNotification(syncedCount);
      }
      
      if (failedCount > 0) {
        this.showSyncFailureNotification(failedCount);
      }

      console.log(`Sync completed: ${syncedCount} successful, ${failedCount} failed`);

    } catch (error) {
      console.error('Offline sync failed:', error);
    } finally {
      this.syncInProgress = false;
    }
  }

  // Handle sync failure for a specific submission
  async handleSyncFailure(submission) {
    try {
      // Increment retry count
      submission.retryCount = (submission.retryCount || 0) + 1;
      submission.lastRetryAt = new Date().toISOString();

      if (submission.retryCount >= submission.maxRetries) {
        console.log(`Max retries reached for submission ${submission.id}, marking as failed`);
        submission.syncFailed = true;
      }

      // Update in database
      const db = await dbManager.getDB();
      await db.put('formSubmissions', submission);
      
    } catch (error) {
      console.error('Failed to handle sync failure:', error);
    }
  }

  // Get pending offline submissions
  async getPendingSubmissions() {
    try {
      return await dbManager.getFormSubmissions(false);
    } catch (error) {
      console.error('Failed to get pending submissions:', error);
      return [];
    }
  }

  // Manually retry failed submissions
  async retryFailedSubmissions() {
    try {
      const allSubmissions = await dbManager.getFormSubmissions(true);
      const failedSubmissions = allSubmissions.filter(s => s.syncFailed && s.retryCount < s.maxRetries);
      
      console.log(`Retrying ${failedSubmissions.length} failed submissions`);
      
      for (const submission of failedSubmissions) {
        submission.syncFailed = false;
        submission.retryCount = 0;
        
        const db = await dbManager.getDB();
        await db.put('formSubmissions', submission);
      }
      
      // Trigger sync
      await this.syncOfflineData();
      
      return failedSubmissions.length;
    } catch (error) {
      console.error('Failed to retry failed submissions:', error);
      return 0;
    }
  }

  // Delete old synced submissions
  async cleanupSyncedSubmissions(olderThanDays = 7) {
    try {
      const db = await dbManager.getDB();
      const tx = db.transaction('formSubmissions', 'readwrite');
      const store = tx.objectStore('formSubmissions');
      
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - olderThanDays);
      
      const allSubmissions = await store.getAll();
      let deletedCount = 0;
      
      for (const submission of allSubmissions) {
        if (submission.synced && new Date(submission.timestamp) < cutoffDate) {
          await store.delete(submission.id);
          deletedCount++;
        }
      }
      
      console.log(`Cleaned up ${deletedCount} old synced submissions`);
      return deletedCount;
    } catch (error) {
      console.error('Failed to cleanup synced submissions:', error);
      return 0;
    }
  }

  // Notification helpers
  async showOfflineNotification() {
    try {
      await pushNotificationService.showLocalNotification(
        'Form Saved Offline',
        {
          body: 'Your form has been saved and will be submitted when you\'re back online.',
          icon: '/vite.svg',
          tag: 'offline-save',
          actions: [
            { action: 'view', title: 'View Pending' },
            { action: 'dismiss', title: 'OK' }
          ],
          data: { type: 'offline-save' }
        }
      );
    } catch (error) {
      console.error('Failed to show offline notification:', error);
    }
  }

  async showSyncSuccessNotification(count) {
    try {
      await pushNotificationService.showLocalNotification(
        'Data Synced Successfully',
        {
          body: `${count} form${count > 1 ? 's' : ''} submitted successfully!`,
          icon: '/vite.svg',
          tag: 'sync-success',
          actions: [
            { action: 'view', title: 'View Results' },
            { action: 'dismiss', title: 'OK' }
          ],
          data: { type: 'sync-success', count }
        }
      );
    } catch (error) {
      console.error('Failed to show sync success notification:', error);
    }
  }

  async showSyncFailureNotification(count) {
    try {
      await pushNotificationService.showLocalNotification(
        'Sync Issues',
        {
          body: `${count} form${count > 1 ? 's' : ''} failed to sync. They will be retried later.`,
          icon: '/vite.svg',
          tag: 'sync-failure',
          requireInteraction: true,
          actions: [
            { action: 'retry', title: 'Retry Now' },
            { action: 'view', title: 'View Details' },
            { action: 'dismiss', title: 'Later' }
          ],
          data: { type: 'sync-failure', count }
        }
      );
    } catch (error) {
      console.error('Failed to show sync failure notification:', error);
    }
  }

  // Utility methods
  get connectionStatus() {
    return {
      online: this.isOnline,
      syncInProgress: this.syncInProgress
    };
  }

  // For debugging
  async getStats() {
    try {
      const allSubmissions = await dbManager.getFormSubmissions(true);
      const pending = allSubmissions.filter(s => !s.synced && !s.syncFailed);
      const synced = allSubmissions.filter(s => s.synced);
      const failed = allSubmissions.filter(s => s.syncFailed);

      return {
        total: allSubmissions.length,
        pending: pending.length,
        synced: synced.length,
        failed: failed.length,
        isOnline: this.isOnline,
        syncInProgress: this.syncInProgress
      };
    } catch (error) {
      console.error('Failed to get stats:', error);
      return null;
    }
  }
}

// Create and export singleton instance
export const offlineFormHandler = new OfflineFormHandler();

// Export class for custom instances
export { OfflineFormHandler };