// GeoFix Service Worker
// Version: 1.1.0
// Provides offline caching and PWA functionality

const CACHE_NAME = 'geofix-v1.1.0';
const RUNTIME_CACHE = 'geofix-runtime';
const IMAGE_CACHE = 'geofix-images';

// Resources to cache on install
const PRECACHE_URLS = [
  '/',
  '/index.html',
  '/login.html',
  '/register.html',
  '/dashboard.html',
  '/submit-complaint.html',
  '/admin-dashboard.html',
  '/css/style.css',
  '/js/auth.js',
  '/js/complaint.js',
  '/js/dashboard.js',
  '/js/admin.js',
  '/js/config.js',
  '/js/install-app.js',
  '/manifest.json',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png'
];

// Install event - cache essential resources
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache');
        // Cache resources, but don't fail if some don't exist
        return Promise.allSettled(
          PRECACHE_URLS.map(url => 
            cache.add(url).catch(err => console.log(`Failed to cache ${url}:`, err))
          )
        );
      })
      .then(() => self.skipWaiting())
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  const validCaches = [CACHE_NAME, RUNTIME_CACHE, IMAGE_CACHE];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (!validCaches.includes(cacheName)) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch event - network first, fall back to cache
self.addEventListener('fetch', (event) => {
  // Skip cross-origin requests
  if (!event.request.url.startsWith(self.location.origin)) {
    return;
  }

  const { request } = event;
  const url = new URL(request.url);

  // Handle image requests with cache-first strategy
  if (request.destination === 'image') {
    event.respondWith(
      caches.open(IMAGE_CACHE).then((cache) => {
        return cache.match(request).then((cachedResponse) => {
          if (cachedResponse) {
            return cachedResponse;
          }
          return fetch(request).then((response) => {
            if (response && response.status === 200) {
              cache.put(request, response.clone());
            }
            return response;
          });
        });
      })
    );
    return;
  }

  // For API calls and Firebase - always try network first
  if (url.pathname.includes('/api/') || 
      url.hostname.includes('firebaseio.com') ||
      url.hostname.includes('firebase')) {
    event.respondWith(
      fetch(request)
        .catch(() => caches.match(request))
    );
    return;
  }

  // For other requests - network first with cache fallback
  event.respondWith(
    caches.open(RUNTIME_CACHE).then((cache) => {
      return fetch(request)
        .then((response) => {
          // Cache successful responses
          if (response && response.status === 200) {
            cache.put(request, response.clone());
          }
          return response;
        })
        .catch(() => {
          // If network fails, try cache
          return caches.match(request).then((cachedResponse) => {
            if (cachedResponse) {
              return cachedResponse;
            }
            // If not in cache and it's a navigation request, return index.html
            if (request.mode === 'navigate') {
              return caches.match('/index.html');
            }
            // Return offline page or error
            return new Response('Offline - Content not available', {
              status: 503,
              statusText: 'Service Unavailable',
              headers: new Headers({
                'Content-Type': 'text/plain'
              })
            });
          });
        });
    })
  );
});

// Background Sync for offline complaint submissions
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-complaints') {
    event.waitUntil(syncComplaints());
  }
});

async function syncComplaints() {
  // This would sync any pending complaints stored in IndexedDB
  // when the connection is restored
  console.log('Syncing pending complaints...');
  
  // Send message to all clients that sync is happening
  const clients = await self.clients.matchAll();
  clients.forEach(client => {
    client.postMessage({
      type: 'SYNC_STARTED',
      message: 'Syncing your offline complaints...'
    });
  });
}

// Handle messages from clients
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'CLEAR_CACHE') {
    event.waitUntil(
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => caches.delete(cacheName))
        );
      })
    );
  }
});

// Push notification support (for future enhancement)
self.addEventListener('push', (event) => {
  if (event.data) {
    const data = event.data.json();
    const options = {
      body: data.body || 'New update available',
      icon: '/icons/icon-192x192.png',
      badge: '/icons/icon-72x72.png',
      vibrate: [200, 100, 200],
      data: {
        url: data.url || '/'
      }
    };
    
    event.waitUntil(
      self.registration.showNotification(data.title || 'GeoFix', options)
    );
  }
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    clients.openWindow(event.notification.data.url || '/')
  );
});
