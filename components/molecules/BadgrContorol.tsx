"use client";

export default function BadgeControl() {
  const setBadge = async () => {
    if ("setAppBadge" in navigator) {
      try {
        // 数字を「5」に設定する
        await (navigator as any).setAppBadge(5); 
        alert("バッジを5に設定しました！ホーム画面を確認してください。");
      } catch (error) {
        console.error("バッジの設定に失敗しました", error);
      }
    } else {
      alert("このブラウザはバッジ機能に対応していません。iPhoneならPWAとして起動してください。");
    }
  };

  const clearBadge = async () => {
    if ("clearAppBadge" in navigator) {
      await (navigator as any).clearAppBadge();
      alert("バッジを消しました。");
    }
  };

  return (
    <div style={{ padding: "20px", display: "flex", gap: "10px" }}>
      <button onClick={setBadge} className="p-2 bg-blue-500 text-white rounded">
        通知を5にする
      </button>
      <button onClick={clearBadge} className="p-2 bg-gray-500 text-white rounded">
        通知を消す
      </button>
    </div>
  );
}