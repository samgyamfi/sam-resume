const CACHE_NAME = "sam-resume";

//Call Install Event
self.addEventListener('install', e => {
    e.waitUntil(self.skipWaiting());
});


//Call Activate Event
self.addEventListener('activate', e => {
    e.waitUntil(
        caches.keys().then(CACHE_NAMES => {
            return Promise.all(
                CACHE_NAMES.filter(cache => {
                    if(cache !== CACHE_NAME){
                        return caches.delete(cache);
                    }
                })
            )
        })
    )
});

//Call Fetch Event
self.addEventListener('fetch', e => {
    e.respondWith(
        fetch(e.request)
            .then(res => {
                const responseClone = res.clone();
                caches
                    .open(CACHE_NAME)
                    .then(cache => {
                        cache.put(e.request, responseClone);
                    });
                return res;
            })
            .catch(err => caches.match(e.request).then(res => res))
    );
});
