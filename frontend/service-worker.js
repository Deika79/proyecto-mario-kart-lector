const CACHE_NAME = "mario-kart-lector-v2";

self.addEventListener("install", event => {
  console.log("Service Worker instalado");
  self.skipWaiting();
});

self.addEventListener("activate", event => {
  console.log("Service Worker activado");
});

self.addEventListener("fetch", event => {

  const url = new URL(event.request.url);

  // ❌ NO interceptar llamadas al backend
  if (url.hostname.includes("onrender.com")) {
    return;
  }

  // ❌ NO interceptar llamadas a API localhost
  if (url.pathname.startsWith("/api")) {
    return;
  }

  event.respondWith(
    fetch(event.request).catch(() => caches.match(event.request))
  );

});