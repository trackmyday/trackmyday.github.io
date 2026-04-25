const CACHE_NAME = 'tmd-cache-v2';
const APP_SHELL_URLS = [
  '/',
  '/logo.png',
  '/icons/logo-192.png',
  '/manifests/home.webmanifest',
  '/manifests/start.webmanifest',
  '/manifests/goals.webmanifest',
  '/manifests/whiteboard.webmanifest',
  '/manifests/counter.webmanifest',
  '/manifests/music.webmanifest',
  '/manifests/tetris.webmanifest',
  '/manifests/lanerash.webmanifest',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL_URLS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.filter((name) => name !== CACHE_NAME).map((name) => caches.delete(name))
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') {
    return;
  }

  const requestUrl = new URL(event.request.url);
  if (requestUrl.origin !== self.location.origin) {
    return;
  }

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        if (response.ok && event.request.url.startsWith('http')) {
          const responseClone = response.clone();
          void caches.open(CACHE_NAME).then((cache) => cache.put(event.request, responseClone));
        }

        return response;
      })
      .catch(async () => {
        const cachedResponse = await caches.match(event.request);
        if (cachedResponse) {
          return cachedResponse;
        }

        if (event.request.mode === 'navigate') {
          return caches.match('/');
        }

        throw new Error(`No cached response for ${event.request.url}`);
      })
  );
});
