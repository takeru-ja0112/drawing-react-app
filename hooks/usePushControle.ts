"use client";
import { useEffect, useState } from "react";

/**
 * PWA対応用のフックス
 */
export default function usePushControle() {
    const [ sub , setSub ] = useState<PushSubscription | null>( null );

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

    useEffect(() => {
        handleSubscribe();
    }, []);

    // ★ ここに提示されたコードを書きます
    const sendTestNotification = async (subscription: any) => {
    //   alert('送信ボタンが押されました。宛先情報'+ JSON.stringify(subscription));
        console.log('送信されました。宛先情報'+ JSON.stringify(subscription));
      await fetch('/api/push', {
        method: 'POST',
        body: JSON.stringify({
          subscription:sub?.toJSON(), 
          title: 'イラストが届いているよ！',
          body: '確認してね！'
        }),
        headers: { 'Content-Type': 'application/json' }
      });
    //   alert("通知リクエストを送信しました！アプリを閉じて待ってください。");
    };

    return { sub, sendTestNotification };

}