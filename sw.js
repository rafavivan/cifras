const CACHE_NAME = "cifras-pwa-v1";

const CORE_ASSETS = [
  "/cifras/",
  "/cifras/index.html",
  "/cifras/manifest.json",
  "/cifras/AcordeScript.js",
  "/cifras/Acordes.js",
  "/cifras/Acordes/",
  "/cifras/Musicas/"
];
// INSTALL
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(CORE_ASSETS);
    })
  );
  self.skipWaiting();
});

// ACTIVATE
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.map(k => (k !== CACHE_NAME && caches.delete(k)))
      )
    )
  );
  self.clients.claim();
});

// FETCH
self.addEventListener("fetch", event => {
  if (event.request.method !== "GET") return;

  event.respondWith(
    caches.match(event.request).then(r => r || fetch(event.request))
  );
});