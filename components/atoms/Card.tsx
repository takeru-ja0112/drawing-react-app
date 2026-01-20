export default function Card({ children , className}: { children: React.ReactNode , className?: string}) {
    return (
        <div 
        className={` backdrop-blur-md bg-white/50 rounded-3xl border border-white border-2 shadow-md p-6 ${className}`}
        >
            {children}
        </div>
    );
}