const CACHE='toka-v4';
const FILES=['./','./index.html','./manifest.json','./icon.svg','./icon-192.png','./icon-512.png','./styles.css','./app.js'];
self.addEventListener('install',e=>{
  e.waitUntil(caches.open(CACHE).then(c=>c.addAll(FILES)).then(()=>self.skipWaiting()));
});
self.addEventListener('activate',e=>{
  e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));
});
self.addEventListener('fetch',e=>{
  e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request).then(res=>{
    if(res&&res.status===200&&e.request.method==='GET'){
      const clone=res.clone();
      caches.open(CACHE).then(c=>c.put(e.request,clone));
    }
    return res;
  }).catch(()=>caches.match('./index.html'))));
});