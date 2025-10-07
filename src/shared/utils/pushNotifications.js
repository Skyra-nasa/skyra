class PushNotificationService {
  constructor() {
    this.publicVapidKey = null; // You'll need to generate VAPID keys for production
    this.subscription = null;
    this.permissionGranted = false;
    this.initializeService();
  }

  async initializeService() {
    try {
      // Check if service worker and push notifications are supported
      if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
        console.warn('Push notifications not supported');
        return false;
      }

      // Check current permission status
      this.permissionGranted = Notification.permission === 'granted';
      
      // If permission granted, try to get existing subscription
      if (this.permissionGranted) {
        await this.getExistingSubscription();
      }

      return true;
    } catch (error) {
      console.error('Failed to initialize push notification service:', error);
      return false;
    }
  }

  async getExistingSubscription() {
    try {
      const registration = await navigator.serviceWorker.ready;
      this.subscription = await registration.pushManager.getSubscription();
      
      if (this.subscription) {
        console.log('Existing push subscription found');
        // Optionally send subscription to server to keep it active
        await this.sendSubscriptionToServer(this.subscription);
      }

      return this.subscription;
    } catch (error) {
      console.error('Failed to get existing subscription:', error);
      return null;
    }
  }

  async requestPermission() {
    try {
      if (Notification.permission === 'granted') {
        this.permissionGranted = true;
        return true;
      }

      if (Notification.permission === 'denied') {
        console.warn('Push notifications are blocked');
        return false;
      }

      // Request permission
      const permission = await Notification.requestPermission();
      this.permissionGranted = permission === 'granted';

      if (this.permissionGranted) {
        console.log('Push notification permission granted');
        return true;
      } else {
        console.warn('Push notification permission denied');
        return false;
      }
    } catch (error) {
      console.error('Error requesting notification permission:', error);
      return false;
    }
  }

  async subscribe() {
    try {
      if (!this.permissionGranted) {
        const granted = await this.requestPermission();
        if (!granted) {
          throw new Error('Permission not granted for push notifications');
        }
      }

      const registration = await navigator.serviceWorker.ready;
      
      // Check if already subscribed
      const existingSubscription = await registration.pushManager.getSubscription();
      if (existingSubscription) {
        this.subscription = existingSubscription;
        console.log('Using existing push subscription');
        return existingSubscription;
      }

      // Create new subscription
      const subscribeOptions = {
        userVisibleOnly: true,
        applicationServerKey: this.urlBase64ToUint8Array(this.publicVapidKey || this.getDefaultVapidKey())
      };

      this.subscription = await registration.pushManager.subscribe(subscribeOptions);
      console.log('New push subscription created');

      // Send subscription to server
      await this.sendSubscriptionToServer(this.subscription);

      return this.subscription;
    } catch (error) {
      console.error('Failed to subscribe to push notifications:', error);
      throw error;
    }
  }

  async unsubscribe() {
    try {
      if (!this.subscription) {
        console.log('No active subscription to unsubscribe from');
        return true;
      }

      const success = await this.subscription.unsubscribe();
      
      if (success) {
        console.log('Successfully unsubscribed from push notifications');
        // Notify server about unsubscription
        await this.removeSubscriptionFromServer(this.subscription);
        this.subscription = null;
        return true;
      } else {
        console.error('Failed to unsubscribe from push notifications');
        return false;
      }
    } catch (error) {
      console.error('Error unsubscribing from push notifications:', error);
      return false;
    }
  }

  async sendSubscriptionToServer(subscription) {
    try {
      // In a real app, you'd send this to your backend
      const subscriptionData = {
        endpoint: subscription.endpoint,
        keys: {
          p256dh: this.arrayBufferToBase64(subscription.getKey('p256dh')),
          auth: this.arrayBufferToBase64(subscription.getKey('auth'))
        }
      };

      console.log('Subscription data:', subscriptionData);
      
      // Store in IndexedDB for now (in production, send to your server)
      if (window.dbManager) {
        await window.dbManager.setUserPreference('pushSubscription', subscriptionData);
      }

      // Uncomment and modify for your backend API
      /*
      const response = await fetch('/api/subscribe-push', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(subscriptionData)
      });

      if (!response.ok) {
        throw new Error('Failed to save subscription on server');
      }
      */

      return true;
    } catch (error) {
      console.error('Failed to send subscription to server:', error);
      return false;
    }
  }

  async removeSubscriptionFromServer(subscription) {
    try {
      // Remove from IndexedDB
      if (window.dbManager) {
        await window.dbManager.setUserPreference('pushSubscription', null);
      }

      // Uncomment and modify for your backend API
      /*
      const response = await fetch('/api/unsubscribe-push', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          endpoint: subscription.endpoint
        })
      });

      if (!response.ok) {
        throw new Error('Failed to remove subscription from server');
      }
      */

      console.log('Subscription removed for endpoint:', subscription?.endpoint);
      return true;
    } catch (error) {
      console.error('Failed to remove subscription from server:', error);
      return false;
    }
  }

  // Show local notification (for testing or immediate feedback)
  async showLocalNotification(title, options = {}) {
    try {
      if (!this.permissionGranted) {
        console.warn('Cannot show notification: permission not granted');
        return false;
      }

      const defaultOptions = {
        body: 'Notification from Skyra',
        icon: '/vite.svg',
        badge: '/vite.svg',
        tag: 'skyra-notification',
        requireInteraction: false,
        actions: []
      };

      const notificationOptions = { ...defaultOptions, ...options };

      if ('serviceWorker' in navigator) {
        const registration = await navigator.serviceWorker.ready;
        await registration.showNotification(title, notificationOptions);
      } else {
        new Notification(title, notificationOptions);
      }

      return true;
    } catch (error) {
      console.error('Failed to show local notification:', error);
      return false;
    }
  }

  // Test push notification functionality
  async testNotification() {
    try {
      await this.showLocalNotification('Test Notification', {
        body: 'This is a test notification from Skyra PWA!',
        icon: '/vite.svg',
        actions: [
          {
            action: 'view',
            title: 'View App'
          },
          {
            action: 'dismiss',
            title: 'Dismiss'
          }
        ],
        data: {
          type: 'test',
          timestamp: new Date().toISOString()
        }
      });

      return true;
    } catch (error) {
      console.error('Failed to send test notification:', error);
      return false;
    }
  }

  // Utility functions
  urlBase64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
      .replace(/-/g, '+')
      .replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  }

  arrayBufferToBase64(buffer) {
    const bytes = new Uint8Array(buffer);
    let binary = '';
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
  }

  getDefaultVapidKey() {
    // This is a placeholder - generate real VAPID keys for production
    // Use: npx web-push generate-vapid-keys
    return 'BEl62iUYgUivxIkv69yViEuiBIa40HI6DLuYSni2FF_DkDJI34VfB_N_ZFgE_bx-0W-Qg_g9tZCjJvR8J_kCdz4';
  }

  // Getters
  get isSubscribed() {
    return !!this.subscription;
  }

  get hasPermission() {
    return this.permissionGranted;
  }

  get notificationSupported() {
    return 'Notification' in window && 'serviceWorker' in navigator && 'PushManager' in window;
  }
}

// Create and export singleton instance
export const pushNotificationService = new PushNotificationService();

// Export class for custom instances
export { PushNotificationService };