import { IconContext } from "react-icons";
import { TbHome, TbUsersGroup, TbSettings, TbHelp } from "react-icons/tb";
import Link from "next/link";

export default function AccessMenu({
    isOpen,
    onClose,
}: {
    isOpen: boolean;
    onClose: () => void;
}) {
    return (
        <>
            <div className={`fixed inset-0 bg-black/50 z-40 ${isOpen ? "block" : "hidden"}`} onClick={onClose}></div>
            <div className={`w-50 bg-white fixed top-0 h-fit shadow-lg z-50 p-6 block ${isOpen ? "left-0" : "-left-full"} transition-left duration-300 rounded-r-xl`}>
                <div className="mb-8">
                    <h2 className="text-2xl font-bold mb-4">メニュー</h2>
                </div>
                <ol>
                    <IconContext.Provider value={{ size: "1.5em", className: "inline-block mr-2" }}>
                        <Link href="/"><li className="my-3 flex px-2 py-1 hover:bg-gray-200 transition duration-200 rounded-full"><TbHome />ホーム</li></Link>
                        <Link href="/lobby"><li className="my-3 flex px-3 py-1 hover:bg-gray-200 transition duration-200 rounded-full"><TbUsersGroup />ロビー</li></Link>
                        <Link href="/settings"><li className="my-3 flex px-3 py-1 hover:bg-gray-200 transition duration-200 rounded-full"><TbSettings />設定</li></Link>
                        <Link href="/help"><li className="my-3 flex px-3 py-1 hover:bg-gray-200 transition duration-200 rounded-full"><TbHelp />ヘルプ</li></Link>
                    </IconContext.Provider>
                </ol>
            </div>
        </>
    )
}