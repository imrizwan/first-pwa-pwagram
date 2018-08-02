// we dont have DOM access in sw

var CACHE_STATIC = 'static-v12';
var CACHE_DYNAMIC = 'dynamic-v6';

self.addEventListener('install', function(event){
    console.log("Installed", event);
    event.waitUntil(
        caches.open(CACHE_STATIC)
            .then(function(cache){
                console.log("[Service Worker]: PreCaching");
                cache.addAll([
                    '/',
                    '/index.html',
                    '/offline.html',
                    '/src/js/app.js',
                    '/src/js/promise.js',
                    '/src/js/fetch.js',
                    '/src/js/feed.js',
                    '/src/js/material.min.js',
                    '/src/css/app.css',
                    '/src/css/feed.css',
                    '/src/images/main-image.jpg',
                    'https://fonts.googleapis.com/css?family=Roboto:400,700',
                    'https://fonts.googleapis.com/icon?family=Material+Icons',
                    'https://cdnjs.cloudflare.com/ajax/libs/material-design-lite/1.3.0/material.indigo-pink.min.css'
                ]);
            }));
        });

self.addEventListener('activate', function(event){
    console.log("Activated", event);
    // Better place cache cleanup code
    // because it runs when all tabs are closed by user
    event.waitUntil(
        // caches.key gives back the array of caches
        caches.keys()
            .then(function(keyList){
                // Promise.all takes an array of promises and waits for all of them to finish
                // Convert array into promises
                return Promise.all(keyList.map(function(key){
                    // if the key is not equal to updated cache
                    if(key !== CACHE_STATIC && key!== CACHE_DYNAMIC){
                        console.log("[Service Worker]: Deleting Cache!", key);
                        return caches.delete(key);
                    }
                }));
            })
    )
    return self.clients.claim();
})

// Hello

self.addEventListener('fetch', function(event){
    var url  = 'https://httpbin.org/get';
    if(event.request.url.indexOf(url) > -1){
        event.respondWith(
            caches.open(CACHE_DYNAMIC)
                .then(function(cache){
                    return fetch(event.request)
                    .then(function(res){
                        cache.put(event.request.url, res.clone());
                        return res;
                    })
                })
        );
    } else {
        event.respondWith(
            caches.match(event.request)
              .then(function(response) {
                if (response) {
                  return response;
                } else {
                  return fetch(event.request)
                    .then(function(res) {
                      return caches.open(CACHE_DYNAMIC)
                        .then(function(cache) {
                          cache.put(event.request.url, res.clone());
                          return res;
                        })
                    })
                    .catch(function(err) {
                        return caches.open(CACHE_STATIC).then(function(cache) {
                            console.log(CACHE_STATIC);
                            if(event.request.url.indexOf('/help')){
                                return cache.match('/offline.html');
                            }
                            });
                    });
                }
              })
          );
    }
});

// self.addEventListener('fetch', function(event){
//     // fetch the data from cache if available
//     // caches - access to overall cache storage
//     // request are the keys
//     // data store in cache as keys
//    event.respondWith(
//        caches.match(event.request)
//         .then(function(response){
//             if(response){
//                 return response;
//             } else {
//                 // Dynamic Caching
//                 return fetch(event.request)
//                     .then(function(res){
//                         // Adding Response to Cache
//                         // if dont return both (res and caches) then, if we make a network request, we can never get a response
//                         return caches.open(CACHE_DYNAMIC).
//                             then(function(cache){
//                                 // add takes a URL/String, sends a request, automatically store response key value pair
//                                 // put requires you to provide a request key value pair
//                                 cache.put(event.request.url, res.clone());
//                                 // cloning the response and storing but returning original data
//                                 // directly loading from netork doesn't work if we don't return
//                                 return res;
//                             }).catch(function(err){
//                                 return caches.open(CACHE_STATIC).then(function(cache) {
//                                     console.log(CACHE_STATIC);
//                                     return cache.match('/offline.html');
//                                 });
//                             });
//                     });
//             }
//         })
//    );
// });

