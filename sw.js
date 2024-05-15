var CACHE_NAME = 'sample-v8';
var urlsToCache = ['/index.html', '/menu.html', '/app.js'];

self.addEventListener('install', function(event) {
  console.log('install開始');
  event.waitUntil(
    caches.open(CACHE_NAME).then(async function(cache) {
      skipWaiting();
      console.log(urlsToCache);
      console.log('をキャッシュします');
      try{
        cache.addAll(urlsToCache);
      } catch(e){
        console.log( e );
      }
      return cache;
    })
  );
});

self.addEventListener('activate', function(event) {
  console.log('activate開始');
  event.waitUntil(
    (function() {
      caches.keys().then(function(oldCacheKeys) {
        console.log(oldCacheKeys);
        oldCacheKeys
          .filter(function(key) {
            return key !== CACHE_NAME;
          })
          .map(function(key) {
            console.log(key + 'を削除しました');
            return caches.delete(key);
          });
      });
      clients.claim();
    })()
  );
});

self.addEventListener('fetch', function(event) {
  console.log('fetch開始');
  event.respondWith(
    caches.match(event.request).then(function(response) {
      if (response) {
        console.log(event.request.url + 'はキャッシュがあるので使う');
        return response;
      }
      console.log(event.request.url + 'はキャッシュが無いのでリクエストする');

      var fetchRequest = event.request.clone();
      return fetch(fetchRequest).then(function(response) {
        if (!response || response.status !== 200 || response.type !== 'basic') {
          return response;
        }

        var responseToCache = response.clone();
        console.log(event.request.url + 'は新しくキャッシュに保管する');
        caches.open(CACHE_NAME).then(function(cache) {
          cache.put(event.request, responseToCache);
        });
        return response;
      });
    })
  );
});
