"use client";

import { IconContext } from "react-icons";
import { TbHome, TbUsersGroup, TbArrowBackUp } from "react-icons/tb";
import Link from "next/link";
import Image from "next/image";
import historyLocalRoom from "@/lib/hitoryLocalRoom";
import { useEffect , useState} from "react";

export default function AccessMenu({
    isOpen,
    onClose,
}: {
    isOpen: boolean;
    onClose: () => void;
}) {
    const [localRoom, setLocalRoom] = useState<string | null>(null);
    const { getLocalRoom } = historyLocalRoom();

    useEffect(() => {
        const localRoom = getLocalRoom();
        setLocalRoom(localRoom);
    }, [])

    return (
        <>
            <div className={`fixed inset-0 backdrop-blur-sm z-40 ${isOpen ? "block" : "hidden"}`} onClick={onClose}></div>
            <div className={`w-70 bg-white fixed top-0 h-fit shadow-lg z-50 p-6 block ${isOpen ? "left-0" : "-left-full"} transition-left duration-300 rounded-r-xl`}>
                <div className="mb-8">
                    <Image src="/minimalDrawIcon.svg" alt="Logo" width={40} height={40} />
                </div>
                <hr className="color-gray-200"></hr>
                <ol>
                    <IconContext.Provider value={{ size: "1.5em", className: "inline-block mr-2" }}>
                        <Link href="/"><li className="my-3 flex px-2 py-1 hover:bg-gray-200 transition duration-200 rounded-full"><TbHome />ホーム</li></Link>
                        <Link href="/lobby"><li className="my-3 flex px-3 py-1 hover:bg-gray-200 transition duration-200 rounded-full"><TbUsersGroup />ロビー</li></Link>
                        {localRoom && <Link href={`/room/${localRoom}`}><li className="my-3 flex px-3 py-1 hover:bg-gray-200 transition duration-200 rounded-full"><TbArrowBackUp />最後に入ったルーム</li></Link>}
                    </IconContext.Provider>
                </ol>
            </div>
        </>
    )
}