const CACHE_NAME = 'gerador-carimbo-cache-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/style.css',
  '/script.js',
  '/images/icons/icon-192x192.png',
  '/images/icons/icon-512x512.png',
  '/images/icons/favicon.ico',
  '/images/icons/install.svg'
];

// Evento de Instalação: Abre o cache e adiciona os arquivos principais.
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Cache aberto');
        // Adiciona todos os URLs definidos ao cache.
        // Se qualquer um falhar, a instalação do service worker falha.
        return cache.addAll(urlsToCache);
      })
  );
});

// Evento de Ativação: Limpa caches antigos.
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            // Se o cache não estiver na lista de permissões, delete-o.
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Evento de Fetch: Intercepta as requisições de rede.
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Se a resposta for encontrada no cache, retorna ela.
        if (response) {
          return response;
        }
        // Caso contrário, faz a requisição à rede.
        return fetch(event.request);
      }
    )
  );
});
