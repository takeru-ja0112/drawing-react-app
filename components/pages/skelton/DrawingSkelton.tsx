import Button from '@/components/atoms/Button';

export default function Loading() {
    return (
        <>
            {/* <BgObject /> */}
            <div className="px-8 pt-2 pb-16">
                <div className="max-w-lg mx-auto text-center">
                    {/* お題 */}
                    <label className="block mb-1 font-semibold text-gray-600">
                        お題
                    </label>
                    <h1 className="text-xl font-bold bg-gray-300 rounded w-32 h-6 mx-auto animate-pulse"></h1>
                    <h1
                        className="text-4xl font-bold mb-4 "
                    >
                        0
                    </h1>
                    <div className="mb-4 flex gap-2 justify-center items-center">
                        <Button className="border border-black px-2 py-1 rounded h-[46px] w-[66px]" />
                        <Button className="border border-black px-2 py-1 rounded h-[46px] w-[66px]" />
                        <Button className="border border-black px-2 py-1 rounded h-[46px]" value="リセット" />
                    </div>


                    {/* Tool selection - カード風デザイン */}
                    <div className="mt-4 flex gap-4 justify-center">
                        <div className={`w-full h-[66px] flex flex-col items-center px-4 py-2 rounded-lg cursor-pointer border border-gray-300 `}>
                        </div>
                        <div className={`w-full h-[66px] flex flex-col items-center px-4 py-2 rounded-lg cursor-pointer border border-gray-300 `}>
                        </div>
                        <div className={`w-full h-[66px] flex flex-col items-center px-4 py-2 rounded-lg cursor-pointer border border-gray-300 `}>
                        </div>
                    </div>
                    <div className={`mx-auto mt-4 border bg-white border-4 border-gray-400 w-[300px] h-[300px] touch-none rounded overflow-hidden`}>
                        <div
                            className="w-[300px] h-[300px] bg-white"
                        ></div>
                    </div>
                </div>
            </div>
        </>
    );
}