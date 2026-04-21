const CACHE = "trip-v4";
const STATIC = [
  "/manifest.json",
  "/icon.svg",
  "/imgs/battery-spencer.jpg",
  "/imgs/bixby.jpg",
  "/imgs/corvette.jpg",
  "/imgs/ggb.jpg",
  "/imgs/glacier-point.jpg",
  "/imgs/mcway.jpg",
  "/imgs/mist-trail.jpg",
  "/imgs/point-lobos.jpg",
  "/imgs/tenaya.jpg",
  "/imgs/yosemite.jpg",
  "/layla-ai-design-system/project/colors_and_type.css",
  "/layla-ai-design-system/project/site/site.css",
  "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css",
  "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js",
  "https://unpkg.com/react@18.3.1/umd/react.development.js",
  "https://unpkg.com/react-dom@18.3.1/umd/react-dom.development.js",
  "https://unpkg.com/@babel/standalone@7.29.0/babel.min.js",
];

self.addEventListener("install", e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(STATIC)).catch(() => {}));
  self.skipWaiting();
});

self.addEventListener("activate", e => {
  e.waitUntil(caches.keys().then(keys =>
    Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
  ));
  self.clients.claim();
});

self.addEventListener("fetch", e => {
  if (e.request.method !== "GET") return;
  const url = e.request.url;

  // HTML files: always network-first, never serve stale
  if (url.endsWith(".html") || url.endsWith("/") || !url.includes(".")) {
    e.respondWith(
      fetch(e.request).catch(() => caches.match(e.request))
    );
    return;
  }

  // Static assets: cache-first
  e.respondWith(
    caches.match(e.request).then(cached => {
      if (cached) return cached;
      return fetch(e.request).then(r => {
        if (r.ok) {
          const clone = r.clone();
          caches.open(CACHE).then(c => c.put(e.request, clone));
        }
        return r;
      });
    })
  );
});
