// Permette di aprire l'app anche senza rete. Prova sempre prima la rete, così gli aggiornamenti arrivano subito.
const CACHE = 'cantinetta-v1';
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', e => e.waitUntil(self.clients.claim()));
self.addEventListener('fetch', e => {
  const r = e.request;
  if (r.method !== 'GET') return;
  const u = new URL(r.url);
  if (u.origin !== location.origin && u.hostname !== 'www.gstatic.com') return;
  e.respondWith(
    fetch(r).then(res => { if (res.ok) { const c = res.clone(); caches.open(CACHE).then(x => x.put(r, c)); } return res; })
      .catch(() => caches.match(r, { ignoreSearch: true }).then(m => m || caches.match('./index.html')))
  );
});
