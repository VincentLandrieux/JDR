const cacheName = 'JDR_PWA-v1';
const appShellFiles = [
  './',
  './index.html',
  './sw.js',
];

const assets = [
    // './assets/scripts/app.js',
    // './assets/styles/style.css',
];
const contentToCache = appShellFiles.concat(assets);

self.addEventListener('install', (e) => {
    console.log('[Service Worker] Installation');

    e.waitUntil(
        caches.open(cacheName).then((cache) => {
            console.log('[Service Worker] Mise en cache');
            return cache.addAll(contentToCache);
        })
    );
});

//clear cache
self.addEventListener('activate', (e) => {
    e.waitUntil(
        caches.keys().then((keyList) => {
            return Promise.all(keyList.map((key) => {
                if(cacheName.indexOf(key) === -1) {
                    return caches.delete(key);
                }
            }));
        })
    );
});

self.addEventListener('fetch', (e) => {
    e.respondWith(
        caches.match(e.request)
        .catch(() => {
            return fetch(e.request);
        })
        .then((r) => {
            // console.log('[Service Worker] Ressource récupérée '+e.request.url);
            
            return r || fetch(e.request).then((response) => {
                return caches.open(cacheName).then((cache) => {
                    console.log('[Service Worker] Mise en cache de la nouvelle ressource: '+e.request.url);
                    cache.put(e.request, response.clone());
                    return response;
                });
            });
        })
    );
});