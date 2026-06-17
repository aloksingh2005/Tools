const CACHE_VERSION = 'v4';
const APP_SHELL_CACHE = `timebook-shell-${CACHE_VERSION}`;
const RUNTIME_CACHE = `timebook-runtime-${CACHE_VERSION}`;
const SCOPE_URL = new URL(self.registration.scope);
const SCOPE_PATH = SCOPE_URL.pathname;
const CORE_ASSET_PATHS = [
  'index.html',
  'calculator.html',
  'history.html',
  'customers.html',
  'analytics.html',
  'settings.html',
  'styles.css',
  'app.js',
  'config.js',
  'pwa.js',
  'manifest.json',
  'icon.png',
  'icons/icon-72.png',
  'icons/icon-96.png',
  'icons/icon-128.png',
  'icons/icon-144.png',
  'icons/icon-152.png',
  'icons/icon-180.png',
  'icons/icon-192.png',
  'icons/icon-384.png',
  'icons/icon-512.png',
  'icons/maskable-192.png',
  'icons/maskable-512.png'
];
const CORE_ASSETS = CORE_ASSET_PATHS.map((path) => new URL(path, SCOPE_URL).pathname);
const APP_FALLBACK = new URL('calculator.html', SCOPE_URL).pathname;

function isCoreAsset(request) {
  const url = new URL(request.url);
  return url.origin === self.location.origin && CORE_ASSETS.includes(url.pathname);
}

function isNavigationRequest(request) {
  return request.mode === 'navigate' || (request.destination === 'document' && request.headers.get('accept')?.includes('text/html'));
}

async function putInCache(cacheName, request, response) {
  if (!response || (!response.ok && response.type !== 'opaque')) return;
  const cache = await caches.open(cacheName);
  await cache.put(request, response.clone());
}

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(APP_SHELL_CACHE)
      .then((cache) => cache.addAll(CORE_ASSETS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(
        keys
          .filter((key) => ![APP_SHELL_CACHE, RUNTIME_CACHE].includes(key))
          .map((key) => caches.delete(key))
      ))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);
  if (url.pathname.startsWith(`${SCOPE_PATH}api`)) return;

  if (isNavigationRequest(request)) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          putInCache(RUNTIME_CACHE, request, response);
          return response;
        })
        .catch(() => caches.match(request).then((cached) => cached || caches.match(APP_FALLBACK)))
    );
    return;
  }

  if (isCoreAsset(request)) {
    event.respondWith(
      caches.match(request).then((cached) => {
        const fresh = fetch(request)
          .then((response) => {
            putInCache(APP_SHELL_CACHE, request, response);
            return response;
          })
          .catch(() => cached);
        return cached || fresh;
      })
    );
    return;
  }

  event.respondWith(
    caches.match(request).then((cached) => {
      const fresh = fetch(request)
        .then((response) => {
          putInCache(RUNTIME_CACHE, request, response);
          return response;
        })
        .catch(() => cached);
      return cached || fresh;
    })
  );
});
