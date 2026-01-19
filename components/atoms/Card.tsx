export default function Card({ children , className}: { children: React.ReactNode , className?: string}) {
    return (
        <div 
        className={`bg-white rounded-3xl shadow-md p-6 ${className}`}
        >
            {children}
        </div>
    );
}