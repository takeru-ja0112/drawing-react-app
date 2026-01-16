"use client";

import Link from "next/link";
import Button from "@/components/atoms/Button";
import Image from "next/image";
import Card from "@/components/atoms/Card";
import { motion } from "motion/react";
import WhatsMinimal from "@/components/molecules/illust/top/WhatsMinimal";
import NoLimitPeople from "@/components/molecules/illust/top/NoLimitPeople ";

export default function HomePage() {
    const title = "Minimal Drawer";

    return (
        <>
            <div
                className="min-w-[320px] flex items-center justify-center px-8 overflow-hidden"
            >
                <div className="max-w-2xl w-90 mx-5 mt-20 mb-30 z-10">
                    {/* メインコンテンツ */}
                    <motion.div
                        className="text-center mb-12 flex flex-col items-center justify-center"
                    // style={{ perspective: "1000px" }}
                    >
                        <motion.div
                            className="mb-6"
                            initial={{}}
                            whileHover={{ rotateZ: -10 }}
                            transition={{ duration: 0.1, ease: "easeInOut" }}
                        >
                            <Image src="/minimalDrawIcon.svg" alt="Logo" width={120} height={120} />
                        </motion.div>
                        {/* タイトル - 3D効果 */}
                        <motion.h1
                            className="text-6xl font-bold"
                        >
                            {title}
                        </motion.h1>
                    </motion.div>

                    {/* ボタンエリア */}
                    <motion.div
                        className="space-y-4"
                    >
                        <div className="mb-2">
                            {/* メインボタン */}
                            <Link href="/lobby">
                                <Button value="ロビーに移動" className="text-xl w-full" />
                            </Link>
                        </div>

                        {/* サブボタン */}
                        <div className="">
                            <Link href="/drawing">
                                <Button value="描画テスト" className="text-xl w-full" />
                            </Link>
                        </div>
                    </motion.div>

                    <div className="mt-30 text-center text-2xl mb-6">
                        <h2 className="font-bold">{title}ってなに？</h2>
                    </div>
                    <Card className="text-center">
                        {/* イメージ */}
                        <WhatsMinimal />
                        <h2 className="text-xl text-gray-700 font-semibold mb-2">お題をシンプルに表現！</h2>
                        <p className="text-gray-600">
                            {title}は出題されたお題を、直線、正円、長方形を使って表現するシンプルなゲーム！
                            <br />
                        </p>
                    </Card>
                    <Card className="mt-10 text-center">
                        {/* イメージ */}
                        <NoLimitPeople />
                        <h2 className="text-xl text-gray-700 font-semibold mb-2">人数制限なし！</h2>
                        <p className="text-gray-600">
                            このゲームでは描く人と答える人で分かれます。描く人は何人でも参加可能！
                            <br />
                            みんなでわいわい楽しもう！
                        </p>
                    </Card>
                </div>
            </div>
        </>
    );
}