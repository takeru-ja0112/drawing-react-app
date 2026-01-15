import { IconContext } from "react-icons";
import { TbHome, TbUsersGroup, TbSettings, TbHelp } from "react-icons/tb";
import Link from "next/link";
import Image from "next/image";

export default function AccessMenu({
    isOpen,
    onClose,
}: {
    isOpen: boolean;
    onClose: () => void;
}) {
    return (
        <>
            <div className={`fixed inset-0 backdrop-blur-sm z-40 ${isOpen ? "block" : "hidden"}`} onClick={onClose}></div>
            <div className={`w-50 bg-white fixed top-0 h-fit shadow-lg z-50 p-6 block ${isOpen ? "left-0" : "-left-full"} transition-left duration-300 rounded-r-xl`}>
                <div className="mb-8">
                    <Image src="/minimalDrawIcon.svg" alt="Logo" width={40} height={40} />
                </div>
                <hr className="color-gray-200"></hr> 
                <ol>
                    <IconContext.Provider value={{ size: "1.5em", className: "inline-block mr-2" }}>
                        <Link href="/"><li className="my-3 flex px-2 py-1 hover:bg-gray-200 transition duration-200 rounded-full"><TbHome />ホーム</li></Link>
                        <Link href="/lobby"><li className="my-3 flex px-3 py-1 hover:bg-gray-200 transition duration-200 rounded-full"><TbUsersGroup />ロビー</li></Link>
                    </IconContext.Provider>
                </ol>
            </div>
        </>
    )
}