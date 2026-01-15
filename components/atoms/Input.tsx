import { motion } from "motion/react";

interface BtnProps {
    value?: string;
    name?: string;
    onClick?: (e: React.MouseEvent<HTMLInputElement>) => void;
    placeholder?: string;
    disabled?: boolean;
    type?: "text" | "password" | "email" | "number";
    className?: string;
    [key: string]: any;
}

export default function Input({ value, name,className, onClick, disabled, type = "text", placeholder, ...props }: BtnProps) {
    return (
        <>
            <label htmlFor={name} className="sr-only">{value}</label>
            <motion.input
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                className={`bg-white border rounded-xl border-gray-500 px-4 py-2 ${className}`}
                onClick={onClick}
                disabled={disabled}
                type={type}
                value={value}
                name={name}
                id={name}
                placeholder={placeholder}
                {...props}
            />
        </>
    );
}