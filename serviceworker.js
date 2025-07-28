self.addEventListener('install', event => {
    console.log('Service worker installed');
    event.waitUntil(
        caches.open('my-cache').then(cache => {
            return cache.addAll([
                '/',
                'index.html',
                'index.css',
                'index.js'
            ]);
        })
    );
});

self.addEventListener('activate', event => {
    console.log('Service worker activated');
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if(cacheName !== 'my-cache') {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});

self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request).then(response => {
            return response || fetch(event.request).then(fetchResponse => {
                return caches.open('my-cache').then(cache => {
                    cache.put(event.request, fetchResponse.clone());
                    return fetchResponse;
                });
            });
        }).catch(() => {
            return caches.match('/offline.html');
        })
    );
})