"use client";

import Link from "next/link";
import { motion, useMotionValue, useTransform, useSpring } from "motion/react";
import { useState, useEffect } from "react";
import Button from "@/components/atoms/Button";
import Image from "next/image";
import Header from "../organisms/Header";

export default function HomePage() {
    const title = "Minimal Drawer";

    return (
        <>
            <div
                className=" bg-gray-200 flex items-center justify-center px-8 overflow-hidden"
            >
                <div className="max-w-2xl w-90 mx-5 mt-50 mb-30 z-10">
                    {/* メインコンテンツ */}
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
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
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.6, duration: 0.5 }}
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
                </div>
            </div>
        </>
    );
}