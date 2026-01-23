"use client";

import BadgeControl from "../molecules/BadgrContorol";
import PushTest from "../molecules/PushContorol";

export default function MobilePage() {

    return (
        <div className="flex flex-col items-center justify-center min-h-screen  p-4">
            <BadgeControl />
            <PushTest />
            <h1 className="text-3xl font-bold mb-6 text-center">モバイル端末ではご利用いただけません</h1>
            <p className="text-lg text-center max-w-md">
                大変申し訳ございませんが、当アプリケーションはモバイル端末でのご利用をサポートしておりません。<br />
                PCまたはタブレット端末からアクセスしていただきますようお願いいたします。
            </p>
        </div>
    );
}