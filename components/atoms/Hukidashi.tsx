export default function Hukidashi({ children , className}: { children: React.ReactNode, className?: string }) {
    return (
        <div
            className={`w-[130px] bg-yellow-400 rounded-4xl p-3 shadow-lg
            before:content-[''] before:absolute
            before:-bottom-1 before:left-1/2 before:-translate-x-1/2 before:bg-yellow-400 
            before:w-[20px] before:h-[20px] 
            before:rotate-45 before:rounded-[4px] before:z-0
            ${className}`}
        >
            {children}
        </div>
    );
}