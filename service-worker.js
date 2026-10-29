const CACHE="postroute-shell-v11";
const SHELL=["./","./index.html","./style.css","./app.js","./manifest.json"];
const LIBS=[
"https://unpkg.com/maplibre-gl@5.6.2/dist/maplibre-gl.css",
"https://unpkg.com/maplibre-gl@5.6.2/dist/maplibre-gl.js",
"https://unpkg.com/pmtiles@4.3.0/dist/pmtiles.js"
];
self.addEventListener("install",event=>event.waitUntil((async()=>{const c=await caches.open(CACHE);await c.addAll(SHELL);await Promise.all(LIBS.map(async u=>{try{const r=await fetch(u,{mode:"cors"});if(r.ok)await c.put(u,r);}catch(_){}}));await self.skipWaiting();})()));
self.addEventListener("activate",event=>event.waitUntil((async()=>{const ks=await caches.keys();await Promise.all(ks.filter(k=>k.startsWith("postroute-shell-")&&k!==CACHE).map(k=>caches.delete(k)));await self.clients.claim();})()));
self.addEventListener("fetch",event=>{if(event.request.method!=="GET")return;const u=new URL(event.request.url);if(u.origin===self.location.origin||LIBS.includes(u.href)||u.hostname==="fonts.openmaptiles.org"){event.respondWith((async()=>{const cached=await caches.match(event.request);if(cached)return cached;const response=await fetch(event.request);if(response.ok){const c=await caches.open(CACHE);c.put(event.request,response.clone()).catch(()=>{});}return response;})().catch(async()=>{const fallback=await caches.match("./index.html");if(fallback&&event.request.mode==="navigate")return fallback;throw new Error("Offline und Datei nicht im Cache");}));}});
