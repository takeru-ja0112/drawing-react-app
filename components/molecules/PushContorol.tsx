"use client";
import { useState } from "react";

export default function PushTest() {
  const [sub, setSub] = useState<any>(null);

  // ステップ3の購読処理
  const handleSubscribe = async () => {
    const registration = await navigator.serviceWorker.ready;
    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!
    });
    setSub(subscription); // 取得した情報をステートに保存
    console.log("Subscribed:", subscription);
  };

  // ★ ここに提示されたコードを書きます
  const sendTestNotification = async (subscription: any) => {
    if (!subscription) {
      alert("先に購読（Subscribe）してください");
      return;
    }

    await fetch('/api/push', {
      method: 'POST',
      body: JSON.stringify({
        subscription, 
        title: 'こんにちは！',
        body: 'PWAからのプッシュ通知テストです。'
      }),
      headers: { 'Content-Type': 'application/json' }
    });
    alert("通知リクエストを送信しました！アプリを閉じて待ってください。");
  };

  return (
    <div className="p-4 space-y-4">
      <button onClick={handleSubscribe} className="bg-green-500 p-2 text-white">
        1. 通知を購読する
      </button>
      
      <button onClick={() => sendTestNotification(sub)} className="bg-blue-500 p-2 text-white">
        2. 自分に通知を飛ばす
      </button>
    </div>
  );
}