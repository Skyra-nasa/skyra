// Service Worker for Skyra PWA
const CACHE_NAME = 'skyra-v1';
const API_CACHE = 'skyra-api-v1';
const BACKGROUND_SYNC_TAG = 'skyra-background-sync';
const NOTIFICATION_TAG = 'skyra-notification';

// Cache strategy resources
const STATIC_CACHE_URLS = [
  '/',
  '/index.html',
  '/src/main.jsx',
  '/src/App.jsx',
  '/src/index.css',
  '/vite.svg',
  '/src/shared/utils/assets/logo.webp'
];

// Install event - cache static resources
self.addEventListener('install', (event) => {
  console.log('[SW] Install event');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[SW] Caching static resources');
        return cache.addAll(STATIC_CACHE_URLS);
      })
      .then(() => {
        console.log('[SW] Skip waiting');
        return self.skipWaiting();
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('[SW] Activate event');
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== CACHE_NAME && cacheName !== API_CACHE) {
              console.log('[SW] Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log('[SW] Claiming clients');
        return self.clients.claim();
      })
  );
});

// Fetch event - network first for API, cache first for static
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Handle API requests with network first strategy
  if (url.pathname.startsWith('/api') || url.hostname === 'nasa.almiraj.xyz') {
    event.respondWith(
      handleApiRequest(request)
    );
    return;
  }

  // Handle static resources with cache first strategy
  event.respondWith(
    handleStaticRequest(request)
  );
});

// Network first strategy for API requests
async function handleApiRequest(request) {
  try {
    const response = await fetch(request);
    
    if (response.ok) {
      const cache = await caches.open(API_CACHE);
      cache.put(request, response.clone());
    }
    
    return response;
  } catch (error) {
    console.log('[SW] Network failed, trying cache for API request:', request.url, error);
    const cachedResponse = await caches.match(request);
    
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Return offline response for failed API requests
    return new Response(
      JSON.stringify({ 
        error: 'Network unavailable', 
        offline: true,
        message: 'Data cached for offline use. Some features may be limited.'
      }),
      { 
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}

// Cache first strategy for static resources
async function handleStaticRequest(request) {
  // Skip caching for chrome-extension and other unsupported schemes
  try {
    const url = new URL(request.url);
    if (url.protocol !== 'http:' && url.protocol !== 'https:') {
      return fetch(request);
    }
  } catch {
    // If URL parsing fails, just try to fetch without caching
    return fetch(request);
  }
  
  const cachedResponse = await caches.match(request);
  
  if (cachedResponse) {
    return cachedResponse;
  }
  
  try {
    const response = await fetch(request);
    
    if (response.ok) {
      // Additional check before caching
      const responseUrl = new URL(response.url);
      if (responseUrl.protocol === 'http:' || responseUrl.protocol === 'https:') {
        const cache = await caches.open(CACHE_NAME);
        cache.put(request, response.clone());
      }
    }
    
    return response;
  } catch (networkError) {
    console.log('[SW] Failed to fetch static resource:', request.url, networkError);
    
    // Return fallback for navigation requests
    if (request.mode === 'navigate') {
      const fallbackResponse = await caches.match('/index.html');
      return fallbackResponse || new Response('Offline', { status: 200 });
    }
    
    return new Response('Resource not available offline', { status: 404 });
  }
}

// Background sync event
self.addEventListener('sync', (event) => {
  console.log('[SW] Background sync event:', event.tag);
  
  if (event.tag === BACKGROUND_SYNC_TAG) {
    event.waitUntil(syncOfflineData());
  }
});

// Sync offline data when connection is restored
async function syncOfflineData() {
  try {
    console.log('[SW] Starting background sync');
    
    // Get offline form submissions from IndexedDB
    const offlineData = await getOfflineFormSubmissions();
    
    for (const submission of offlineData) {
      try {
        const response = await fetch(submission.url, {
          method: submission.method || 'POST',
          headers: submission.headers || { 'Content-Type': 'application/json' },
          body: JSON.stringify(submission.data)
        });
        
        if (response.ok) {
          // Remove successfully synced data
          await removeOfflineSubmission(submission.id);
          
          // Send success notification
          await self.registration.showNotification('Sync Complete', {
            body: 'Your offline form submission has been processed successfully!',
            icon: '/vite.svg',
            tag: NOTIFICATION_TAG,
            badge: '/vite.svg',
            data: { type: 'sync-success', submissionId: submission.id }
          });
        }
      } catch (syncError) {
        console.error('[SW] Failed to sync submission:', syncError);
      }
    }
  } catch (error) {
    console.error('[SW] Background sync failed:', error);
  }
}

// Push notification event
self.addEventListener('push', (event) => {
  console.log('[SW] Push event received');
  
  let notificationData = {
    title: 'Skyra Notification',
    body: 'You have a new update!',
    icon: '/vite.svg',
    badge: '/vite.svg',
    tag: NOTIFICATION_TAG
  };
  
  if (event.data) {
    try {
      const pushData = event.data.json();
      notificationData = { ...notificationData, ...pushData };
    } catch (error) {
      console.error('[SW] Failed to parse push data:', error);
    }
  }
  
  event.waitUntil(
    self.registration.showNotification(notificationData.title, {
      body: notificationData.body,
      icon: notificationData.icon,
      badge: notificationData.badge,
      tag: notificationData.tag,
      data: notificationData.data || {}
    })
  );
});

// Notification click event
self.addEventListener('notificationclick', (event) => {
  console.log('[SW] Notification click event');
  
  event.notification.close();
  
  event.waitUntil(
    self.clients.openWindow('/')
  );
});

// Helper functions for IndexedDB operations
async function getOfflineFormSubmissions() {
  try {
    // Import IDB directly in service worker
    const { openDB } = await import('https://unpkg.com/idb@7/build/index.js');
    
    const db = await openDB('skyra-pwa-db', 1);
    const tx = db.transaction('formSubmissions', 'readonly');
    const store = tx.objectStore('formSubmissions');
    const index = store.index('synced');
    
    // Get unsynced submissions
    return await index.getAll(false);
  } catch (error) {
    console.error('[SW] Failed to get offline submissions:', error);
    return [];
  }
}

async function removeOfflineSubmission(id) {
  try {
    const { openDB } = await import('https://unpkg.com/idb@7/build/index.js');
    
    const db = await openDB('skyra-pwa-db', 1);
    const tx = db.transaction('formSubmissions', 'readwrite');
    const store = tx.objectStore('formSubmissions');
    
    const submission = await store.get(id);
    if (submission) {
      submission.synced = true;
      submission.syncedAt = new Date().toISOString();
      await store.put(submission);
    }
    
    console.log('[SW] Marked submission as synced:', id);
  } catch (error) {
    console.error('[SW] Failed to mark submission as synced:', error);
  }
}

// Message event for communication with main thread
self.addEventListener('message', (event) => {
  console.log('[SW] Message received:', event.data);
  
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});