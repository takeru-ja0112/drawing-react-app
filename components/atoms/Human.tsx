export default function Human({ className, colorClass }: { className?: string, colorClass?: string }) {
    return (
        <>
            <div className={`flex justify-center relative ${className}`}>

                {/* 正円 */}
                <div className={`w-[25px] h-[25px] absolute rounded-full 
                                    left-1/2 -translate-x-1/2
                                    ${colorClass}
                                    `}></div>
                {/* 長方形 */}
                <div className={`w-[30px] h-[50px] absolute rounded-t-full rounded-b-md
                                    left-1/2 -translate-x-1/2
                                    top-7
                                    ${colorClass}`}
                ></div>
            </div>
        </>
    )
}