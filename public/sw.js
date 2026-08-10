const CACHE_NAME = 'orbita-pwa-cache-v2';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icon-192.png',
  '/icon-512.png',
  '/icon-maskable-192.png',
  '/icon-maskable-512.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      // Robust caching: cache assets individually so any single failure does not block PWA installation
      const cachePromises = ASSETS_TO_CACHE.map((asset) => {
        return cache.add(asset).catch((err) => {
          console.warn(`[PWA Service Worker] Could not cache asset during install: ${asset}`, err);
        });
      });
      return Promise.all(cachePromises);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            return caches.delete(cache);
          }
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  // Only handle GET requests from same origin
  if (event.request.method !== 'GET' || !event.request.url.startsWith(self.location.origin)) {
    return;
  }
  
  // Exclude API calls, dev server websockets, and Firebase endpoints
  if (
    event.request.url.includes('/api/') || 
    event.request.url.includes('identitytoolkit') || 
    event.request.url.includes('firestore') ||
    event.request.url.includes('@vite') ||
    event.request.url.includes('@react')
  ) {
    return;
  }

  // Network First strategy for navigation / HTML / JS modules to prevent stale bundle crash loops
  const isHtmlOrScript = 
    event.request.mode === 'navigate' || 
    event.request.destination === 'document' ||
    event.request.destination === 'script' ||
    (event.request.headers.get('accept') && event.request.headers.get('accept').includes('text/html'));

  if (isHtmlOrScript) {
    event.respondWith(
      fetch(event.request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const copy = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
          }
          return networkResponse;
        })
        .catch(() => {
          return caches.match(event.request).then((cached) => cached || caches.match('/index.html') || caches.match('/'));
        })
    );
    return;
  }

  // Stale-While-Revalidate for static images and assets
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        fetch(event.request).then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, networkResponse));
          }
        }).catch(() => { /* Ignore background update failures */ });
        return cachedResponse;
      }

      return fetch(event.request).then((networkResponse) => {
        if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
          return networkResponse;
        }
        const responseToCache = networkResponse.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseToCache);
        });
        return networkResponse;
      }).catch(() => {
        if (event.request.mode === 'navigate') {
          return caches.match('/') || caches.match('/index.html');
        }
      });
    })
  );
});
