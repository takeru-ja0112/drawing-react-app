"use client";

import Link from "next/link";
import { motion, useMotionValue, useTransform, useSpring } from "motion/react";
import { useState, useEffect } from "react";
import Button from "@/components/atoms/Button";

export default function HomePage() {
    const title = "Minimal Drawer";

    return (
        <div
            className="min-h-screen bg-gray-200 flex items-center justify-center p-8 overflow-hidden"
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
                            <Button value="ロビーに移動" className="text-xl w-full"/>
                        </Link>
                    </div>

                    {/* サブボタン */}
                    <div className="">
                        <Link href="/drawing">
                            <Button value="描画テスト" className="text-xl w-full"/>
                        </Link>
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