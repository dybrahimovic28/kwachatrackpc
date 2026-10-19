// KwachaTrack Production Service Worker
const CACHE_NAME = 'kwachatrack-shell-v1';

// Static application shell assets
const SHELL_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/images/kwachatrack-logo.png',
  '/images/icon-192x192.png',
  '/images/icon-512x512.png',
  '/images/kwachatrackbackground.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(SHELL_ASSETS);
    }).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const request = event.request;
  const url = new URL(request.url);

  // 1. Only process GET requests
  if (request.method !== 'GET') {
    return;
  }

  // 2. CRITICAL: NEVER cache or intercept Supabase API, authentication, or financial endpoints
  if (
    url.hostname.includes('supabase.co') ||
    url.pathname.includes('/auth/') ||
    url.pathname.includes('/rest/') ||
    url.pathname.includes('/realtime/') ||
    url.searchParams.has('code') ||
    url.hash.includes('access_token') ||
    url.pathname.startsWith('/api')
  ) {
    // Pass directly to network
    return;
  }

  // 3. Navigation requests (HTML pages): Network-first with cache fallback
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request).catch(() => {
        return caches.match('/index.html') || caches.match('/');
      })
    );
    return;
  }

  // 4. Static assets (JS, CSS, images, fonts): Cache-first with network fallback
  if (
    url.pathname.startsWith('/assets/') ||
    url.pathname.startsWith('/images/') ||
    url.pathname.endsWith('.js') ||
    url.pathname.endsWith('.css') ||
    url.pathname.endsWith('.png') ||
    url.pathname.endsWith('.webp') ||
    url.pathname.endsWith('.ico') ||
    url.hostname.includes('fonts.googleapis.com') ||
    url.hostname.includes('fonts.gstatic.com')
  ) {
    event.respondWith(
      caches.match(request).then((cachedResponse) => {
        if (cachedResponse) {
          return cachedResponse;
        }
        return fetch(request).then((networkResponse) => {
          if (
            networkResponse &&
            networkResponse.status === 200 &&
            networkResponse.type === 'basic'
          ) {
            const responseToCache = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(request, responseToCache);
            });
          }
          return networkResponse;
        });
      })
    );
    return;
  }

  // Default: pass through to network
  event.respondWith(fetch(request));
});
