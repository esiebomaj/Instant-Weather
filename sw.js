// var version = "v1::";

// self.addEventListener("install", function (event) {
//   console.log("WORKER: install event in progress.");
//   event.waitUntil(
//     caches
//       .open(version + "fundamentals")
//       .then(function (cache) {
//         return cache.addAll([
//           "/",
//           "/index.js",
//           "index.css",
//           "./fontawesome-free-5.14.0-web/",
//         ]);
//       })
//       .then(function () {
//         console.log("WORKER: install completed");
//       })
//   );
// });

// self.addEventListener("fetch", function (event) {
//   console.log("WORKER: fetch event in progress.");

//   if (event.request.method !== "GET") {
//     console.log(
//       "WORKER: fetch event ignored.",
//       event.request.method,
//       event.request.url
//     );
//     return;
//   }

//   event.respondWith(
//     caches.match(event.request).then(function (cached) {
//       var networked = fetch(event.request)
//         .then(fetchedFromNetwork, unableToResolve)
//         .catch(unableToResolve);

//       console.log(
//         "WORKER: fetch event",
//         cached ? "(cached)" : "(network)",
//         event.request.url
//       );
//       return cached || networked;

//       function fetchedFromNetwork(response) {
//         var cacheCopy = response.clone();

//         console.log("WORKER: fetch response from network.", event.request.url);

//         caches
//           .open(version + "pages")
//           .then(function add(cache) {
//             cache.put(event.request, cacheCopy);
//           })
//           .then(function () {
//             console.log(
//               "WORKER: fetch response stored in cache.",
//               event.request.url
//             );
//           });

//         return response;
//       }

//       function unableToResolve() {
//         console.log("WORKER: fetch request failed in both cache and network.");

//         return new Response("<h1>Service Unavailable</h1>", {
//           status: 503,
//           statusText: "Service Unavailable",
//           headers: new Headers({
//             "Content-Type": "text/html",
//           }),
//         });
//       }
//     })
//   );
// });

// self.addEventListener("activate", function (event) {
//   console.log("WORKER: activate event in progress.");
//   event.waitUntil(
//     caches
//       .keys()
//       .then(function (keys) {
//         return Promise.all(
//           keys
//             .filter(function (key) {
//               return !key.startsWith(version);
//             })
//             .map(function (key) {
//               return caches.delete(key);
//             })
//         );
//       })
//       .then(function () {
//         console.log("WORKER: activate completed.");
//       })
//   );
// });

const CACHE_NAME = "version-1";
const urlsToCache = ["index.html", "offline.html"];

const self = this;

// Install SW
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("Opened cache");

      return cache.addAll(urlsToCache);
    })
  );
});

// Listen for requests
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then(() => {
      return fetch(event.request).catch(() => caches.match("offline.html"));
    })
  );
});

// Activate the SW
self.addEventListener("activate", (event) => {
  const cacheWhitelist = [];
  cacheWhitelist.push(CACHE_NAME);

  event.waitUntil(
    caches.keys().then((cacheNames) =>
      Promise.all(
        cacheNames.map((cacheName) => {
          if (!cacheWhitelist.includes(cacheName)) {
            return caches.delete(cacheName);
          }
        })
      )
    )
  );
});
