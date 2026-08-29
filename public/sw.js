// Tombstone service worker.
//
// MineSkin no longer ships a service worker. Serwist was removed because
// `@serwist/next` only attaches through the webpack() hook, so under Turbopack
// it silently emitted nothing and `/sw.js` was answered by the `[lang]`
// catch-all as HTML.
//
// Nothing registers a worker any more, but browsers that registered the old
// Serwist worker still have it installed and re-fetch this exact URL on their
// periodic update check. While that URL returned HTML the check failed on the
// wrong MIME type, so those clients kept running the stale worker
// indefinitely — including its bug of answering failed navigations with an
// empty body, which renders as a blank white page.
//
// Serving real JavaScript here lets the update check succeed: this worker
// replaces the old one, clears its caches, and unregisters itself. Once that
// has had time to reach the install base, this file can be deleted.
//
// Deliberately does not call `client.navigate()` to reload open tabs. This is
// an editor; a surprise reload mid-edit is worse than waiting for the next
// natural navigation, at which point the page is no longer controlled.

self.addEventListener("install", () => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(keys.map((key) => caches.delete(key)));
      await self.registration.unregister();
    })(),
  );
});
