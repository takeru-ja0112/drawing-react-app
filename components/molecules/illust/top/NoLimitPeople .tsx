import Human from "@/components/atoms/Human";
import { TbHeartHandshake } from "react-icons/tb";

export default function NoLimitPeople() {
    return (
        <div className="mb-4 h-[150px] w-full flex justify-center">
            <div className="w-1/2 flex flex-col align-items-center">
                <h2 className="font-semibold mb-5">Answer</h2>
                <Human className="" colorClass="bg-yellow-500" />
            </div>
            <TbHeartHandshake className="self-center mx-0 -ml-8 text-yellow-600" size={40} />
            <div className="w-1/2 flex flex-col align-items-center">
                <h2 className="font-semibold mb-5">Drawer</h2>
                <Human className="left-1/2 translate-x-[-50%] z-1" colorClass="bg-yellow-500" />
                <Human className="left-1/2 translate-x-[-75%]" colorClass="bg-yellow-200" />
                <Human className="left-1/2 translate-x-[-25%]" colorClass="bg-yellow-200" />
            </div>
        </div>
    )
}