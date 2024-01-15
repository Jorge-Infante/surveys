const CACHE_VERSION = 'v3.6';

importScripts(
  "https://storage.googleapis.com/workbox-cdn/releases/6.2.0/workbox-sw.js"
);

if (workbox) {
  workbox.precaching.precacheAndRoute(self.__WB_MANIFEST);
} else {
  console.error("Workbox could not be loaded. No offline support.");
}
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open("survey-app-cache").then((cache) => {
      return cache.addAll([
        "/",
        "/index.html",
        "/app.js",
        // Add other static assets
      ]);
    })
  );
});

self.addEventListener("activate", (event)=>{
  console.log('AHORA ESTÁ ACTIVO EL SERVICE WORKER')
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_VERSION) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
})
self.addEventListener("fetch", (event) => {
  console.log('EVENT LISTERNET FETCH: ',event)
  const resp = new Response(`offLine`)

  
  if (event.request.url.includes('https://test-apiothras.djsoftwaremakers.com')){
    const res = fetch(event.request).catch(()=>{
      return resp
    })
    event.respondWith(res)
  }
});

self.addEventListener('message', (event) => {
  if (event.data.action === 'skipWaiting') {
    self.skipWaiting();
  }
});