import { NextResponse } from 'next/server';
import webpush from 'web-push';

// VAPIDキーの設定（.env.local に保存することを推奨）
webpush.setVapidDetails(
  'mailto:your-email@example.com',
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
  process.env.VAPID_PRIVATE_KEY!
);

export async function POST(request: Request) {
  console.log('プッシュ通知リクエストを受信しました');
  const { subscription, title, body } = await request.json();
  console.log('Subscription:', subscription);
  try {
    await webpush.sendNotification(
      subscription,
      JSON.stringify({ title, body })
    );
    console.log('送信しました！', NextResponse.json({ success: true }));
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('送信エラー:', error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}