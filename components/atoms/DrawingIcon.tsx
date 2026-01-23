"use client";

import { TbPencil } from "react-icons/tb";
import { motion } from "framer-motion";

export default function Loading({ className }: { className?: string }) {
    return (
        <div
            className="flex items-center justify-center h-full"
        >
            <motion.div
                initial={{ x: -5 , rotate: 0 , y: -2 }}
                animate={{ x: 5, rotate: -70 , y: -2 }}
                transition={{ repeat: Infinity, duration: 0.5, ease: "easeInOut", repeatType: "reverse" }}
            >
                <TbPencil className={` ${className}`} />
            </motion.div>
        </div>
    );
}