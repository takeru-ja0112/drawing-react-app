"use client";

import BadgeControl from "../molecules/BadgrContorol";
import PushTest from "../molecules/PushContorol";

export default function MobilePage() {

    return (
        <div className="flex flex-col items-center justify-center min-h-screen  p-4">
            <BadgeControl />
            <PushTest />
            <h1 className="text-3xl font-bold mb-6 text-center">こちらの画面はブラウザでは期待通りに動作しません</h1>
            <p className="text-lg text-center max-w-md">
                ホーム画面に追加してからのご利用をお願いいたします。<br />
            </p>
        </div>
    );
}