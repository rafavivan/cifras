const CACHE_NAME = "cifras-pwa-v1";

const ASSETS = [
  "./",
  "./Indice.html",
  "./AcordeScript.js",
  "./Acordes.js",
  "./manifest.json"
];

// Install
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

// Activate
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.map(k => k !== CACHE_NAME && caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Fetch
self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(response =>
      response || fetch(event.request).then(fetchRes => {
        if (event.request.url.startsWith(self.location.origin)) {
          const clone = fetchRes.clone();
          caches.open(CACHE_NAME).then(cache =>
            cache.put(event.request, clone)
          );
        }
        return fetchRes;
      })
    )
  );
});
