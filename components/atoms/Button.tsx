"use client";

import { motion } from "motion/react";
import React from "react";

interface BtnProps {
    value: string;
    onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
    disabled?: boolean;
    type?: "button" | "submit" | "reset";
    className?: string;
    [key: string]: any;
}

export default function Btn({ value, className ,onClick, disabled, type = "button", ...props }: BtnProps) {
    return (
        <motion.button
            whileHover={{ scale: 1.02, y: -5 }}
            whileTap={{ scale: 0.95 }}
            className={`text-black bg-white border border-dotted border-3 font-bold py-2 px-4 rounded-2xl shadow-lg hover:shadow-2xl transition-shadow duration-300 ${className}`}
            onClick={onClick}
            disabled={disabled}
            type={type}
            {...props}
        >
            {value}
        </motion.button>
    );
}