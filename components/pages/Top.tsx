"use client";

import Link from "next/link";
import { motion, useMotionValue, useTransform, useSpring } from "motion/react";
import { useState, useEffect } from "react";

export default function HomePage() {
    const title = "Minimal Drawer";

    return (
        <div
            className="min-h-screen bg-gradient-to-br from-orange-100 via-pink-50 to-yellow-100 flex items-center justify-center p-8 overflow-hidden"
        >
            <div className="max-w-2xl w-full relative z-10">
                {/* メインコンテンツ */}
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="text-center mb-12"
                    style={{ perspective: "1000px" }}
                >
                    {/* タイトル - 3D効果 */}
                    <motion.h1
                        className="text-6xl font-bold mb-4"
                        style={{
                            transformStyle: "preserve-3d",
                            WebkitBackgroundClip: "text",
                            backgroundClip: "text",
                        }}
                    >
                        {title}
                    </motion.h1>
                </motion.div>

                {/* ボタンエリア */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.6, duration: 0.5 }}
                    className="space-y-4"
                >
                    <div className="mb-2">
                        {/* メインボタン */}
                        <Link href="/lobby">
                            <motion.button
                                whileHover={{ scale: 1.05, y: -5 }}
                                whileTap={{ scale: 0.95 }}
                                className="w-full bg-orange-500 text-white text-xl font-bold py-6 px-8 rounded-2xl shadow-lg hover:shadow-2xl transition-shadow duration-300"
                            >
                                ロビーに移動
                            </motion.button>
                        </Link>
                    </div>

                    {/* サブボタン */}
                    <div className="">
                        <Link href="/drawing">
                            <motion.button
                                whileHover={{ scale: 1.05, y: -5 }}
                                whileTap={{ scale: 0.95 }}
                                className="bg-white/80 backdrop-blur-sm text-pink-600 font-semibold py-4 px-6 rounded-xl shadow-md  border-2 border-pink-200 w-full"
                            >
                                描画テスト
                            </motion.button>
                        </Link>
                    </div>
                </motion.div>


                {/* ゲーム説明 */}
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.9, duration: 0.6 }}
                    className="mt-12 bg-white/60 backdrop-blur-sm rounded-2xl p-6 shadow-lg"
                >
                    <h2 className="text-xl font-bold text-orange-600 mb-4 text-center">
                        ゲームの流れ
                    </h2>
                    <div className="space-y-3 text-gray-700">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 1.1 }}
                            className="flex items-start gap-3"
                        >
                            <span className="text-2xl">1️⃣</span>
                            <p>お題に沿って、直線・長方形・円だけで描画</p>
                        </motion.div>
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 1.3 }}
                            className="flex items-start gap-3"
                        >
                            <span className="text-2xl">2️⃣</span>
                            <p>要素数が少ない順に回答者に公開される</p>
                        </motion.div>
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 1.5 }}
                            className="flex items-start gap-3"
                        >
                            <span className="text-2xl">3️⃣</span>
                            <p>シンプルに描くほど高得点のチャンス！</p>
                        </motion.div>
                    </div>
                </motion.div>
            </div>

            {/* 背景装飾アニメーション */}
            <div className="fixed inset-0 -z-0 overflow-hidden pointer-events-none">
                <motion.div
                    animate={{
                        x: [0, 100, 0],
                        y: [0, -50, 0],
                        scale: [1, 1.2, 1],
                    }}
                    transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute top-20 left-10 w-32 h-32 bg-orange-300/20 rounded-full blur-3xl"
                />
                <motion.div
                    animate={{
                        x: [0, -80, 0],
                        y: [0, 60, 0],
                        scale: [1, 1.3, 1],
                    }}
                    transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute bottom-20 right-10 w-40 h-40 bg-pink-300/20 rounded-full blur-3xl"
                />
                <motion.div
                    animate={{
                        x: [0, 50, -50, 0],
                        y: [0, -40, 40, 0],
                        scale: [1, 1.1, 1.2, 1],
                    }}
                    transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute top-1/2 left-1/2 w-36 h-36 bg-yellow-300/20 rounded-full blur-3xl"
                />
            </div>
        </div>
    );
}