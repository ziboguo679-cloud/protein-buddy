/* 蛋白质小助手 - Service Worker
 * 缓存策略：预缓存应用外壳，更新时按版本号整体替换并清理旧缓存。
 * 修改本文件请同步递增 CACHE_VERSION，否则客户端不会拿到新页面。
 */
const CACHE_VERSION = "protein-buddy-v8";
const ASSETS = [
  "./",
  "./index.html",
  "./app.js",
  "./manifest.json",
  "./icon-192.png",
  "./icon-512.png",
  "./icon-maskable-512.png",
  "./apple-touch-icon.png",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_VERSION).then((cache) => cache.addAll(ASSETS)).then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE_VERSION).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;
  event.respondWith(
    caches.match(event.request, { ignoreSearch: true }).then((cached) => {
      if (cached) {
        // 后台静默更新（stale-while-revalidate）
        fetch(event.request).then((resp) => {
          if (resp && resp.ok) {
            caches.open(CACHE_VERSION).then((cache) => cache.put(event.request, resp.clone()));
          }
        }).catch(() => {});
        return cached;
      }
      return fetch(event.request).then((resp) => {
        if (resp && resp.ok && new URL(event.request.url).origin === self.location.origin) {
          const copy = resp.clone();
          caches.open(CACHE_VERSION).then((cache) => cache.put(event.request, copy));
        }
        return resp;
      });
    })
  );
});
