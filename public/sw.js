const CACHE_NAME = 'lonar-3d-v1';

// Install Event
self.addEventListener('install', (event) => {
  self.skipWaiting();
});

// Activate Event
self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

// Fetch Event (Network First Strategy for smooth 3D asset loading)
self.addEventListener('fetch', (event) => {
  // Pass through network requests
  event.respondWith(
    fetch(event.request).catch(() => {
      return caches.match(event.request);
    })
  );
});
