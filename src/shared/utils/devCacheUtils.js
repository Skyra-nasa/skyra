// Development cache clearing utility
// Run this in browser console during development to clear all caches

export const clearAllCaches = async () => {
  try {
    // Clear all cache storage
    const cacheNames = await caches.keys();
    await Promise.all(
      cacheNames.map(cacheName => {
        console.log('Deleting cache:', cacheName);
        return caches.delete(cacheName);
      })
    );
    
    // Clear service worker registration
    if ('serviceWorker' in navigator) {
      const registrations = await navigator.serviceWorker.getRegistrations();
      await Promise.all(
        registrations.map(registration => {
          console.log('Unregistering service worker:', registration.scope);
          return registration.unregister();
        })
      );
    }
    
    // Clear localStorage and sessionStorage
    localStorage.clear();
    sessionStorage.clear();
    
    // Clear IndexedDB (if any)
    if ('indexedDB' in window) {
      // You can add specific database clearing here if needed
    }
    
    console.log('All caches and storage cleared!');
    console.log('Reload the page to see fresh content.');
    
    return true;
  } catch (error) {
    console.error('Error clearing caches:', error);
    return false;
  }
};

// Auto-clear caches in development mode
if (import.meta.env.DEV) {
  console.log('Development mode detected. Run clearAllCaches() in console to clear all caches.');
  
  // Make it globally available in development
  if (typeof window !== 'undefined') {
    window.clearAllCaches = clearAllCaches;
  }
}

export default clearAllCaches;