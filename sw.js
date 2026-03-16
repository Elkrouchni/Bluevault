const CACHE = 'bluevault-v1';
const ASSETS = ['/', '/index.html', '/manifest.json'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)));
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys =>
    Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
  ));
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  // Réseau d'abord pour les appels API, cache sinon
  if (e.request.url.includes('api.anthropic.com') ||
      e.request.url.includes('nominatim.openstreetmap.org')) {
    return; // toujours réseau pour l'IA et le géocodage
  }
  e.respondWith(
    fetch(e.request).catch(() => caches.match(e.request))
  );
});
