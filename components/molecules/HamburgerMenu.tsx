import { motion } from 'motion/react';

export default function HamburgerMenu({
    setIsOpen,
}: {
    setIsOpen: (isOpen: boolean) => void;
}) {
    return (
        <button
            onClick={() => setIsOpen(true)}
        >
            <div className="space-y-1.5">
                <motion.div
                    whileHover={{ rotate: 45, y: 8 }}
                    className="w-7 h-0.5 bg-gray-600"
                ></motion.div>
                <motion.div
                    whileHover={{ rotate: -45, y: -8 }}
                    className="w-7 h-0.5 bg-gray-600"
                ></motion.div>
                <motion.div
                    whileHover={{ rotate: 45, y: 8 }}
                    className="w-7 h-0.5 bg-gray-600"
                ></motion.div>
            </div>
        </button>
    )
}