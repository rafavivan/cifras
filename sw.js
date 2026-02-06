const CACHE_NAME = "cifras-pwa-v1";

const CORE_ASSETS = [
  "/cifras/",
  "/cifras/Indice.html",
  "/cifras/manifest.json",
  "/cifras/AcordeScript.js",
  "/cifras/Acordes.js",
  "/cifras/Musicas/"
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
  if (event.request.method !== "GET") return;
  const req = event.request;

  // Allow normal navigation between HTML files
  if (req.mode === "navigate") {
    event.respondWith(
      fetch(req).catch(() => caches.match(req))
    );
    return;
  }

  // Cache-first for assets (images, JS, CSS)
  event.respondWith(
    caches.match(req).then(cached => {
      if (cached) return cached;
      return fetch(req).then(response => {
        if (
          response &&
          response.status === 200 &&
          response.type === "basic"
        ) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then(cache =>
            cache.put(req, clone)
          );
        }
        return response;
      });
    })
  );
});

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
