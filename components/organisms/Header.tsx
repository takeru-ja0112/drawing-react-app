"use client"

import { motion } from "motion/react";
import React from "react";
import AccessMenu from "./AccessMenu";
import { useState } from "react";

export default function Header() {
    const [ isOpen , setIsOpen ] = useState<boolean>(false);
    
    return (
        <>
            <header className="flex items-center justify-between bg-white shadow-md p-4">
                <nav>
                    {/* ハンバーガーメニューの作成 */}
                    <button
                        onClick={() => setIsOpen(true)} 
                    >
                        <div className="space-y-1.5">
                            <div className="w-7 h-0.5 bg-gray-600"></div>
                            <div className="w-7 h-0.5 bg-gray-600"></div>
                            <div className="w-7 h-0.5 bg-gray-600"></div>
                        </div>
                    </button>
                </nav>
                <div className="w-full bg-white">
                    <h1 className="text-2xl font-bold text-center">Minimal Drawer</h1>
                </div>
            </header>
            <AccessMenu isOpen={isOpen} onClose={() => setIsOpen(false)} />
        </>
    )
}