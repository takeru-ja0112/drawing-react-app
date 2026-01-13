"use client";

import { motion } from "motion/react";

export default function Btn({ children }: { children: React.ReactNode }) {
    return (
        <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="border border-black text-black px-4 py-2 rounded-full"
        >
            {children}
        </motion.button>
    );
}