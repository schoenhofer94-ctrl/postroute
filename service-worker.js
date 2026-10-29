const CACHE = "postroute-shell-v10";
const SHELL = ["./", "./index.html", "./style.css", "./app.js", "./manifest.json"];
// Cache only the app shell and Leaflet library. Do NOT bulk-cache OpenStreetMap tiles:
// the public OSM tile server does not permit offline prefetching.
const REMOTE_ASSETS = [
  "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css",
  "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js",
  "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png"
];
self.addEventListener("install", event => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE);
    await cache.addAll(SHELL);
    // Best-effort cache of Leaflet so the route list and map controls can load offline.
    await Promise.all(REMOTE_ASSETS.map(async url => {
      try {
        const response = await fetch(url, { mode: "cors", cache: "reload" });
        if (response.ok) await cache.put(url, response);
      } catch (_) { /* Keep install successful if a CDN is temporarily unavailable. */ }
    }));
    await self.skipWaiting();
  })());
});
self.addEventListener("activate", event => event.waitUntil((async () => {
  const keys = await caches.keys();
  await Promise.all(keys.filter(key => key.startsWith("postroute-shell-") && key !== CACHE).map(key => caches.delete(key)));
  await self.clients.claim();
})()));
self.addEventListener("fetch", event => {
  if (event.request.method !== "GET") return;
  const url = new URL(event.request.url);
  const isLeafletAsset = REMOTE_ASSETS.includes(url.href);
  if (url.origin === self.location.origin || isLeafletAsset) {
    event.respondWith((async () => {
      const cached = await caches.match(event.request);
      if (cached) return cached;
      try {
        const response = await fetch(event.request);
        if (response && response.ok && (url.origin === self.location.origin || isLeafletAsset)) {
          const cache = await caches.open(CACHE);
          cache.put(event.request, response.clone()).catch(() => {});
        }
        return response;
      } catch (error) {
        if (url.origin === self.location.origin) {
          const fallback = await caches.match("./index.html");
          if (fallback && event.request.mode === "navigate") return fallback;
        }
        throw error;
      }
    })());
  }
});
