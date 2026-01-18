"use client"

import AccessMenu from "./AccessMenu";
import { useState, useRef, useEffect } from "react";
import HamburgerMenu from "../molecules/HamburgerMenu";
import Image from "next/image";
import Link from "next/link";


export default function Header() {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [showHeader, setShowHeader] = useState<boolean>(true);
    const lastScrollY = useRef(0);

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > lastScrollY.current && window.scrollY > 20) {
                // スクロールダウン
                setShowHeader(false);
            } else {
                // スクロールアップ
                setShowHeader(true);
            }
            lastScrollY.current = window.scrollY;
        };

        window.addEventListener("scroll", handleScroll);
        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);

    return (
        <>
            <header
                className={`h-20 fixed top-2 left-0 rounded-full w-[75%] min-w-[300px] left-1/2 -translate-x-1/2 z-40 transition-transform duration-500 ${
                    showHeader ? "translate-y-0" : "-translate-y-[120%]"
                } flex items-center justify-between bg-white shadow-md px-7`}
            >
                <nav>
                    {/* ハンバーガーメニューの作成 */}
                    <HamburgerMenu setIsOpen={setIsOpen} />
                </nav>
                <div className="w-full bg-white flex justify-center">
                    <Link href="/">
                        <Image src="/minimalDrawIcon.svg" alt="Logo" width={50} height={50} loading="eager"/>
                    </Link>
                </div>
            </header>
            <AccessMenu isOpen={isOpen} onClose={() => setIsOpen(false)} />
        </>
    )
}