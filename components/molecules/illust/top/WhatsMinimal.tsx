import Hukidashi from "@/components/atoms/Hukidashi"

export default function WhatsMinimal() {
    return (
        <div className="mb-4 w-full flex justify-center">
            <div className="relative w-[150px] h-[150px] mx-auto border-4 border-gray-300 rounded-lg shadow-lg">
                <Hukidashi className="w-fit absolute rotate-[-30deg] -left-10">
                    <p className="font-bold">みかん</p>
                </Hukidashi>
                <Hukidashi className="w-fit absolute left-7 -top-0">
                    <p className="font-bold">地球</p>
                </Hukidashi>
                <Hukidashi className="w-fit absolute rotate-[20deg] -right-13">
                    <p className="font-bold">エッフェル塔</p>
                </Hukidashi>
                {/* 正円 */}
                <div className="w-[50px] h-[50px] border border-gray-700 absolute border-4 rounded-full
                                bottom-5 left-3
                                "></div>
                {/* 長方形 */}
                <div className="w-[60px] h-[40px] border border-gray-700 absolute border-4 rounded-md
                                bottom-10 right-3
                                "></div>
                {/* 線 */}
                <div className="absolute border-b-4 border-gray-700
                                bottom-13 left-10 w-20 rotate-[-20deg]
                                 "
                ></div>

            </div>
        </div>
    )
}