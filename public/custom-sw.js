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
