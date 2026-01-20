"use client";

import { IconContext } from "react-icons";
import { TbHome, TbUsersGroup, TbArrowBackUp, TbPencil } from "react-icons/tb";
import Link from "next/link";
import Image from "next/image";
import historyLocalRoom from "@/lib/hitoryLocalRoom";
import { useRouter } from "next/navigation";

export default function AccessMenu({
    isOpen,
    onClose,
}: {
    isOpen: boolean;
    onClose: () => void;
}) {
    const { getLocalRoom } = historyLocalRoom();
    const router = useRouter();

    const handleGoToLastRoom = () => {
        const latestRoom = getLocalRoom();
        if (latestRoom) {
            router.push(`/room/${latestRoom}`);
            onClose();
        }
    };

    return (
        <>
            <div className={`fixed inset-0 bg-white/50 z-40 ${isOpen ? "block" : "hidden"}`} onClick={onClose}></div>
            <div className={`w-70 bg-white fixed top-3 h-fit shadow-lg z-50 p-6 block ${isOpen ? "left-0 opacity-100" : "-left-full opacity-0"} transition-left duration-400 rounded-r-xl`}>
                <div className="mb-8">
                    <Image src="/minimalDrawIcon.svg" alt="Logo" width={40} height={40} />
                </div>
                <hr className="border-gray-300"></hr>
                <ol>
                    <IconContext.Provider value={{ size: "1.5em", className: "inline-block mr-2" }}>
                        <Link href="/" onClick={onClose}><li className="my-3 flex px-2 py-1 hover:bg-gray-200 transition duration-200 rounded-full"><TbHome />ホーム</li></Link>
                        <Link href="/lobby" onClick={onClose}><li className="my-3 flex px-3 py-1 hover:bg-gray-200 transition duration-200 rounded-full"><TbUsersGroup />ロビー</li></Link>
                        <Link href="/drawing" onClick={onClose}><li className="my-3 flex px-3 py-1 hover:bg-gray-200 transition duration-200 rounded-full"><TbPencil />試し書き</li></Link>
                        {getLocalRoom() && (
                            <>
                                <hr className="border-gray-300" />
                                <button onClick={handleGoToLastRoom} className="w-full text-left">
                                    <li className="my-3 flex px-3 py-1 hover:bg-gray-200 transition duration-200 rounded-full">
                                        <TbArrowBackUp />最後に入ったルーム
                                    </li>
                                </button>
                            </>
                        )}
                    </IconContext.Provider>
                </ol>
            </div>
        </>
    )
}