"use client";
import Button from "@/components/atoms/Button";
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
    alert('送信ボタンが押されました。宛先情報'+ JSON.stringify(subscription));

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
    <div className="p-4 grid grid-cols-2 gap-4">
      <Button onClick={handleSubscribe} 
        value="1. 購読（Subscribe）する"
       />
      
      <Button onClick={() => sendTestNotification(sub)} 
        value="2. テスト通知を送る"
      />
    </div>
  );
}