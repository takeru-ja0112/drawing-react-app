// public/custom-sw.js
self.addEventListener('push', (event) => {
  const data = event.data ? event.data.json() : { title: '通知', body: '新着メッセージです' };
  event.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.body,
      icon: '/icon512_rounded.png',
    })
  );
});

// 通知をクリックした時の動作
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(clients.openWindow('/'));
});

// sw.js の showNotification 部分
self.registration.showNotification(data.title, {
  body: data.body,
  icon: '/icon-192x192.png',
  badge: '/icon-192x192.png',
  vibrate: [200, 100, 200], // 振動パターンを追加
  tag: 'test-notification', // 通知が重ならないようにタグ付け
  renotify: true
})