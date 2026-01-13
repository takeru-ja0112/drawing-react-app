"use client";

import { motion } from "motion/react";

export default function Btn({value , ...props }: { value: string , props?:any}) {
    return (
        <motion.button
            whileHover={{ scale: 1.02, y: -5 }}
            whileTap={{ scale: 0.95 }}
            className="w-full text-black bg-white border border-dotted border-6 text-xl font-bold py-6 px-8 rounded-2xl shadow-lg hover:shadow-2xl transition-shadow duration-300"
            {...props}
        >
            {value}
        </motion.button>
    );
}