// Nombre único de la caché para esta aplicación
const CACHE_NAME = 'pizarra-aire-pwa-v2';

// Archivos esenciales para que funcione rápidamente
const urlsToCache = [
  './',
  './index.html',
  './manifest.json',
  './icono.png',
  './logofirma.png'
];

// 1. Al instalar, guardamos los archivos en caché
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Caché abierta. Archivos guardados.');
        return cache.addAll(urlsToCache);
      })
  );
  self.skipWaiting();
});

// 2. Al activar, borramos cachés viejos si actualizamos la versión
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('Borrando caché antigua:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// 3. Al hacer peticiones, buscamos en caché primero
self.addEventListener('fetch', event => {
  // Ignoramos librerías externas pesadas (Tailwind) para que no bloqueen
  if (event.request.url.includes('cdn.tailwindcss.com')) {
      return; 
  }

  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Devuelve de la caché si existe, si no, busca en internet
        return response || fetch(event.request);
      })
  );
});