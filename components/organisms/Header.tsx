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
            if (window.scrollY > lastScrollY.current && window.scrollY > 100) {
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
                className={`h-20 fixed top-0 left-0 w-full z-40 transition-transform duration-500 ${
                    showHeader ? "translate-y-0" : "-translate-y-full"
                } flex items-center justify-between bg-white shadow-md p-4`}
            >
                <nav>
                    {/* ハンバーガーメニューの作成 */}
                    <HamburgerMenu setIsOpen={setIsOpen} />
                </nav>
                <div className="w-full bg-white flex justify-center">
                    <Link href="/">
                        <Image src="/minimalDrawIcon.svg" alt="Logo" width={50} height={50} />
                    </Link>
                </div>
            </header>
            <AccessMenu isOpen={isOpen} onClose={() => setIsOpen(false)} />
        </>
    )
}