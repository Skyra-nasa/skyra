import { openDB } from 'idb';

const DB_NAME = 'skyra-pwa-db';
const DB_VERSION = 1;

// Database stores
const STORES = {
  FORM_SUBMISSIONS: 'formSubmissions',
  CACHED_DATA: 'cachedData',
  USER_PREFERENCES: 'userPreferences',
  SYNC_QUEUE: 'syncQueue'
};

class IndexedDBManager {
  constructor() {
    this.dbPromise = null;
    this.initDB();
  }

  async initDB() {
    try {
      this.dbPromise = openDB(DB_NAME, DB_VERSION, {
        upgrade(db) {
          // Form submissions store for offline data
          if (!db.objectStoreNames.contains(STORES.FORM_SUBMISSIONS)) {
            const formStore = db.createObjectStore(STORES.FORM_SUBMISSIONS, {
              keyPath: 'id',
              autoIncrement: true
            });
            formStore.createIndex('timestamp', 'timestamp');
            formStore.createIndex('type', 'type');
            formStore.createIndex('synced', 'synced');
          }

          // Cached data store for API responses
          if (!db.objectStoreNames.contains(STORES.CACHED_DATA)) {
            const cacheStore = db.createObjectStore(STORES.CACHED_DATA, {
              keyPath: 'key'
            });
            cacheStore.createIndex('timestamp', 'timestamp');
            cacheStore.createIndex('expiry', 'expiry');
          }

          // User preferences store
          if (!db.objectStoreNames.contains(STORES.USER_PREFERENCES)) {
            db.createObjectStore(STORES.USER_PREFERENCES, {
              keyPath: 'key'
            });
          }

          // Background sync queue
          if (!db.objectStoreNames.contains(STORES.SYNC_QUEUE)) {
            const syncStore = db.createObjectStore(STORES.SYNC_QUEUE, {
              keyPath: 'id',
              autoIncrement: true
            });
            syncStore.createIndex('timestamp', 'timestamp');
            syncStore.createIndex('priority', 'priority');
            syncStore.createIndex('retryCount', 'retryCount');
          }
        }
      });

      console.log('IndexedDB initialized successfully');
      return this.dbPromise;
    } catch (error) {
      console.error('Failed to initialize IndexedDB:', error);
      throw error;
    }
  }

  async getDB() {
    if (!this.dbPromise) {
      await this.initDB();
    }
    return this.dbPromise;
  }

  // Form Submissions Methods
  async saveFormSubmission(formData, type = 'general') {
    try {
      const db = await this.getDB();
      const submission = {
        data: formData,
        type,
        timestamp: new Date().toISOString(),
        synced: false,
        url: formData.submitUrl || '/api/submit',
        method: formData.method || 'POST',
        headers: formData.headers || { 'Content-Type': 'application/json' }
      };

      const result = await db.add(STORES.FORM_SUBMISSIONS, submission);
      console.log('Form submission saved offline:', result);
      return result;
    } catch (error) {
      console.error('Failed to save form submission:', error);
      throw error;
    }
  }

  async getFormSubmissions(includesynced = false) {
    try {
      const db = await this.getDB();
      const tx = db.transaction(STORES.FORM_SUBMISSIONS, 'readonly');
      const store = tx.objectStore(STORES.FORM_SUBMISSIONS);
      
      if (includesynced) {
        return await store.getAll();
      } else {
        const index = store.index('synced');
        return await index.getAll(false);
      }
    } catch (error) {
      console.error('Failed to get form submissions:', error);
      return [];
    }
  }

  async markSubmissionSynced(id) {
    try {
      const db = await this.getDB();
      const tx = db.transaction(STORES.FORM_SUBMISSIONS, 'readwrite');
      const store = tx.objectStore(STORES.FORM_SUBMISSIONS);
      
      const submission = await store.get(id);
      if (submission) {
        submission.synced = true;
        submission.syncedAt = new Date().toISOString();
        await store.put(submission);
        console.log('Form submission marked as synced:', id);
      }
    } catch (error) {
      console.error('Failed to mark submission as synced:', error);
      throw error;
    }
  }

  async deleteFormSubmission(id) {
    try {
      const db = await this.getDB();
      await db.delete(STORES.FORM_SUBMISSIONS, id);
      console.log('Form submission deleted:', id);
    } catch (error) {
      console.error('Failed to delete form submission:', error);
      throw error;
    }
  }

  // Cached Data Methods
  async setCachedData(key, data, ttlMinutes = 60) {
    try {
      const db = await this.getDB();
      const expiry = new Date();
      expiry.setMinutes(expiry.getMinutes() + ttlMinutes);

      const cacheEntry = {
        key,
        data,
        timestamp: new Date().toISOString(),
        expiry: expiry.toISOString()
      };

      await db.put(STORES.CACHED_DATA, cacheEntry);
      console.log('Data cached:', key);
    } catch (error) {
      console.error('Failed to cache data:', error);
      throw error;
    }
  }

  async getCachedData(key) {
    try {
      const db = await this.getDB();
      const cacheEntry = await db.get(STORES.CACHED_DATA, key);
      
      if (!cacheEntry) {
        return null;
      }

      // Check if cached data has expired
      const now = new Date();
      const expiry = new Date(cacheEntry.expiry);
      
      if (now > expiry) {
        await this.deleteCachedData(key);
        return null;
      }

      return cacheEntry.data;
    } catch (error) {
      console.error('Failed to get cached data:', error);
      return null;
    }
  }

  async deleteCachedData(key) {
    try {
      const db = await this.getDB();
      await db.delete(STORES.CACHED_DATA, key);
      console.log('Cached data deleted:', key);
    } catch (error) {
      console.error('Failed to delete cached data:', error);
    }
  }

  async clearExpiredCache() {
    try {
      const db = await this.getDB();
      const tx = db.transaction(STORES.CACHED_DATA, 'readwrite');
      const store = tx.objectStore(STORES.CACHED_DATA);
      const index = store.index('expiry');
      
      const now = new Date().toISOString();
      const expiredEntries = await index.getAll(IDBKeyRange.upperBound(now));
      
      for (const entry of expiredEntries) {
        await store.delete(entry.key);
      }
      
      console.log('Cleared expired cache entries:', expiredEntries.length);
    } catch (error) {
      console.error('Failed to clear expired cache:', error);
    }
  }

  // User Preferences Methods
  async setUserPreference(key, value) {
    try {
      const db = await this.getDB();
      await db.put(STORES.USER_PREFERENCES, { key, value });
      console.log('User preference saved:', key);
    } catch (error) {
      console.error('Failed to save user preference:', error);
      throw error;
    }
  }

  async getUserPreference(key, defaultValue = null) {
    try {
      const db = await this.getDB();
      const preference = await db.get(STORES.USER_PREFERENCES, key);
      return preference ? preference.value : defaultValue;
    } catch (error) {
      console.error('Failed to get user preference:', error);
      return defaultValue;
    }
  }

  // Sync Queue Methods
  async addToSyncQueue(operation, data, priority = 1) {
    try {
      const db = await this.getDB();
      const syncItem = {
        operation,
        data,
        priority,
        timestamp: new Date().toISOString(),
        retryCount: 0,
        maxRetries: 3
      };

      const result = await db.add(STORES.SYNC_QUEUE, syncItem);
      console.log('Added to sync queue:', result);
      return result;
    } catch (error) {
      console.error('Failed to add to sync queue:', error);
      throw error;
    }
  }

  async getSyncQueue() {
    try {
      const db = await this.getDB();
      const tx = db.transaction(STORES.SYNC_QUEUE, 'readonly');
      const store = tx.objectStore(STORES.SYNC_QUEUE);
      const index = store.index('priority');
      
      // Get items sorted by priority (higher first)
      return await index.getAll();
    } catch (error) {
      console.error('Failed to get sync queue:', error);
      return [];
    }
  }

  async removeSyncItem(id) {
    try {
      const db = await this.getDB();
      await db.delete(STORES.SYNC_QUEUE, id);
      console.log('Sync item removed:', id);
    } catch (error) {
      console.error('Failed to remove sync item:', error);
    }
  }

  async incrementRetryCount(id) {
    try {
      const db = await this.getDB();
      const tx = db.transaction(STORES.SYNC_QUEUE, 'readwrite');
      const store = tx.objectStore(STORES.SYNC_QUEUE);
      
      const item = await store.get(id);
      if (item) {
        item.retryCount += 1;
        item.lastRetry = new Date().toISOString();
        await store.put(item);
        console.log('Retry count incremented:', id, item.retryCount);
      }
    } catch (error) {
      console.error('Failed to increment retry count:', error);
    }
  }

  // Database maintenance
  async clearAllData() {
    try {
      const db = await this.getDB();
      const storeNames = Object.values(STORES);
      
      for (const storeName of storeNames) {
        await db.clear(storeName);
      }
      
      console.log('All IndexedDB data cleared');
    } catch (error) {
      console.error('Failed to clear all data:', error);
      throw error;
    }
  }

  async getDatabaseSize() {
    try {
      if ('storage' in navigator && 'estimate' in navigator.storage) {
        const estimate = await navigator.storage.estimate();
        return {
          used: estimate.usage,
          available: estimate.quota,
          usedMB: Math.round(estimate.usage / 1024 / 1024 * 100) / 100,
          availableMB: Math.round(estimate.quota / 1024 / 1024 * 100) / 100
        };
      }
      return null;
    } catch (error) {
      console.error('Failed to get database size:', error);
      return null;
    }
  }
}

// Create and export a singleton instance
export const dbManager = new IndexedDBManager();

// Export the class for testing or custom instances
export { IndexedDBManager, STORES };