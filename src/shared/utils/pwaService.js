// PWA Service Registration and Management
class PWAService {
  constructor() {
    this.swRegistration = null;
    this.updateAvailable = false;
    this.isOffline = !navigator.onLine;
    this.init();
  }

  async init() {
    try {
      // Register service worker
      await this.registerServiceWorker();
      
      // Initialize IndexedDB
      await this.initializeIndexedDB();
      
      // Setup offline/online listeners
      this.setupNetworkListeners();
      
      // Initialize push notifications
      await this.initializePushNotifications();
      
      console.log('PWA Service initialized successfully');
    } catch (error) {
      console.error('Failed to initialize PWA service:', error);
    }
  }

  async registerServiceWorker() {
    if (!('serviceWorker' in navigator)) {
      console.log('Service Worker not supported');
      return null;
    }

    try {
      // First try to register with Vite PWA
      if (import.meta.env.PROD) {
        const { registerSW } = await import('virtual:pwa-register');
        
        const updateSW = registerSW({
          onNeedRefresh() {
            console.log('New content available, please refresh.');
            // You can show a notification here
          },
          onOfflineReady() {
            console.log('App ready to work offline.');
          },
          onRegistered(registration) {
            console.log('SW registered:', registration);
            this.swRegistration = registration;
          },
          onRegisterError(error) {
            console.log('SW registration error:', error);
          }
        });

        // Store update function globally for manual updates
        window.updateSW = updateSW;
      } else {
        // Development mode - register custom service worker
        this.swRegistration = await navigator.serviceWorker.register('/sw.js');
        console.log('Custom SW registered:', this.swRegistration);
      }

      // Listen for service worker updates
      if (this.swRegistration) {
        this.swRegistration.addEventListener('updatefound', () => {
          const newWorker = this.swRegistration.installing;
          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                console.log('New service worker available');
                this.updateAvailable = true;
                this.notifyUpdate();
              }
            });
          }
        });
      }

      return this.swRegistration;
    } catch (error) {
      console.error('Service Worker registration failed:', error);
      return null;
    }
  }

  async initializeIndexedDB() {
    try {
      // Import and initialize IndexedDB manager
      const { dbManager } = await import('@/shared/storage/indexedDB');
      
      // Make it globally accessible
      window.dbManager = dbManager;
      
      // Initialize the database
      await dbManager.getDB();
      
      console.log('IndexedDB initialized');
      return true;
    } catch (error) {
      console.error('Failed to initialize IndexedDB:', error);
      return false;
    }
  }

  async initializePushNotifications() {
    try {
      const { pushNotificationService } = await import('@/shared/utils/pushNotifications');
      
      // Make it globally accessible
      window.pushService = pushNotificationService;
      
      // Initialize the service
      await pushNotificationService.initializeService();
      
      console.log('Push notification service initialized');
      return true;
    } catch (error) {
      console.error('Failed to initialize push notifications:', error);
      return false;
    }
  }

  setupNetworkListeners() {
    const handleOnline = () => {
      console.log('Network connection restored');
      this.isOffline = false;
      this.triggerSync();
    };

    const handleOffline = () => {
      console.log('Network connection lost');
      this.isOffline = true;
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Check connection quality periodically
    if ('connection' in navigator) {
      navigator.connection.addEventListener('change', () => {
        console.log('Connection changed:', navigator.connection.effectiveType);
      });
    }
  }

  async triggerSync() {
    try {
      // Import and trigger offline sync
      const { offlineFormHandler } = await import('@/shared/utils/offlineFormHandler');
      await offlineFormHandler.syncOfflineData();
    } catch (error) {
      console.error('Failed to trigger sync:', error);
    }
  }

  async notifyUpdate() {
    try {
      if (window.pushService) {
        await window.pushService.showLocalNotification(
          'App Update Available',
          {
            body: 'A new version of Skyra is available. Tap to update.',
            tag: 'app-update',
            requireInteraction: true,
            actions: [
              { action: 'update', title: 'Update Now' },
              { action: 'later', title: 'Later' }
            ],
            data: { type: 'app-update' }
          }
        );
      }
    } catch (error) {
      console.error('Failed to show update notification:', error);
    }
  }

  async updateApp() {
    try {
      if (window.updateSW) {
        await window.updateSW();
      } else if (this.swRegistration && this.swRegistration.waiting) {
        this.swRegistration.waiting.postMessage({ type: 'SKIP_WAITING' });
        window.location.reload();
      }
    } catch (error) {
      console.error('Failed to update app:', error);
    }
  }

  // Utility methods
  get serviceWorkerReady() {
    return !!this.swRegistration;
  }

  get hasUpdate() {
    return this.updateAvailable;
  }

  get offline() {
    return this.isOffline;
  }

  async getAppInfo() {
    try {
      const info = {
        serviceWorkerReady: this.serviceWorkerReady,
        hasUpdate: this.hasUpdate,
        offline: this.offline,
        pwaInstallable: !!window.deferredPrompt,
        pushSupported: 'PushManager' in window,
        notificationPermission: 'Notification' in window ? Notification.permission : 'unsupported'
      };

      if (window.dbManager) {
        info.storageInfo = await window.dbManager.getDatabaseSize();
      }

      return info;
    } catch (error) {
      console.error('Failed to get app info:', error);
      return null;
    }
  }

  async clearAppData() {
    try {
      // Clear IndexedDB
      if (window.dbManager) {
        await window.dbManager.clearAllData();
      }

      // Clear caches
      if ('caches' in window) {
        const cacheNames = await caches.keys();
        await Promise.all(
          cacheNames.map(cacheName => caches.delete(cacheName))
        );
      }

      // Clear localStorage and sessionStorage
      localStorage.clear();
      sessionStorage.clear();

      console.log('App data cleared');
      return true;
    } catch (error) {
      console.error('Failed to clear app data:', error);
      return false;
    }
  }
}

// Create and export singleton instance
export const pwaService = new PWAService();

// Make it globally accessible for debugging
if (typeof window !== 'undefined') {
  window.pwaService = pwaService;
}

export default pwaService;