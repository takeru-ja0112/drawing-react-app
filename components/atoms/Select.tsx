import { Listbox } from '@headlessui/react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

const options = [
    { value: 'option1', label: 'オプション1' },
    { value: 'option2', label: 'オプション2' },
    { value: 'option3', label: 'オプション3' },
];

export default function Select() {
    const [selected, setSelected] = useState(options[0]);

    return (
        <div className="relative w-48">
            <Listbox value={selected} onChange={setSelected}>
                {({ open }) => (
                    <>
                        <Listbox.Button className="bg-white border border-gray-300 rounded-xl px-4 py-2 w-full text-left cursor-pointer focus:outline-none focus:ring-2 focus:ring-yellow-400">
                            {selected.label}
                        </Listbox.Button>
                        <AnimatePresence>
                            {open && (
                                <Listbox.Options static>
                                    <motion.ul
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: 10 }}
                                        transition={{ duration: 0.18 }}
                                        className="absolute mt-1 w-full bg-white border border-gray-200 rounded-xl shadow-lg z-10 overflow-hidden"
                                    >
                                        {options.map((option) => (
                                            <Listbox.Option
                                                key={option.value}
                                                value={option}
                                                className={({ active, selected }) =>
                                                    `px-4 py-2 cursor-pointer ${active ? 'bg-yellow-100' : ''} ${selected ? 'font-bold text-yellow-700' : ''}`
                                                }
                                            >
                                                {option.label}
                                            </Listbox.Option>
                                        ))}
                                    </motion.ul>
                                </Listbox.Options>
                            )}
                        </AnimatePresence>
                    </>
                )}
            </Listbox>
        </div>
    );
}