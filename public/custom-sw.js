// public/sw.js

// プッシュイベントを受け取った時の処理
self.addEventListener('push', function (event) {
  console.log('Pushイベントを受信しました');

  let data = { title: '通知です', body: '新着メッセージがあります' };

  if (event.data) {
    try {
      // サーバーから送られてきたJSONを解析
      data = event.data.json();
    } catch (e) {
      // JSONでない場合はテキストとして取得
      data = { title: '通知', body: event.data.text() };
    }
  }

  const options = {
    body: data.body,
    // icon: '/icon-192x192.png', // あなたのアプリのアイコンパス
    // badge: '/icon-192x192.png',
    // vibrate: [100, 50, 100],   // 振動パターン
    // data: {
    //   dateOfArrival: Date.now(),
    // },
  };

  // ★重要：iOSで通知を出すための必須命令
  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

// 通知をクリックした時の処理（任意）
self.addEventListener('notificationclick', function (event) {
  event.notification.close();
  event.waitUntil(
    clients.openWindow('/') // 通知をクリックしたらアプリを開く
  );
});