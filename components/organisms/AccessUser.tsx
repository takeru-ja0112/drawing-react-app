import { usePresence } from '@/hooks/usePresence';
import { useState } from 'react';
import { getOrCreateUser, type UserInfo } from '@/lib/user';
import { motion } from 'framer-motion';
import { TbGhost2, TbUserFilled, TbArrowLeft } from 'react-icons/tb';

export default function AccessUser({ roomId }: { roomId: string }) {
    const user: UserInfo = (getOrCreateUser());
    const { users } = usePresence(roomId, user.id, user.username);
    const [isOpen, setIsOpen] = useState(true);
    const [isfullName, setIsFullName] = useState(false);

    return (
        <>
            <div className="absolute right-2 top-17 bg-blur-sm bg-white/60 border border-white rounded-3xl p-2 pb-2 z-10 shadow-lg">
                <motion.button
                    initial={{ rotate: 0 }}
                    animate={{ rotate: isOpen ? 0 : -90 }}
                    className='mx-auto mb-2 flex items-center justify-end'
                    onClick={() => setIsOpen(!isOpen)}
                >
                    < TbArrowLeft className='text-gray-500 hover:text-gray-700' size={20} />
                </motion.button>
                <motion.button
                    className={`mx-auto mb-2 flex items-center justify-end`}
                    onClick={() => setIsFullName(!isfullName)}
                >
                    < TbUserFilled className='text-gray-500 mx-auto mb-2' size={20} />
                </motion.button>
                {users.length > 0 ? (
                    <motion.div
                        initial={{ height: '0px' }}
                        animate={{ height: isOpen ? '0px' : 'auto' }}
                        transition={{ duration: 0.5 , type: 'spring' , bounce: 0.4 }}
                        className='grid gap-2 max-h-50 overflow-y-auto rounded-2xl'
                    >
                        {users.map((user, index) => (
                            <motion.div
                                initial={{ opacity: 0, x: 10 }}
                                animate={{ opacity: 1, x: 0, width: isfullName && !isOpen ? '100px' : '40px' }}
                                transition={{ duration: 0.5, type: 'spring' , bounce: 0.4 }}
                                key={index}
                                className=''
                            >
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, x: 10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.2 }}
                                    className='p-2 bg-yellow-400 rounded-full text-center font-bold text-xs whitespace-nowrap overflow-hidden text-ellipsis'
                                >
                                    {
                                        isfullName ? user.user_name :
                                            user.user_name.charAt(0)
                                    }
                                </motion.div>
                            </motion.div>
                        ))}
                    </motion.div>
                ) : (
                    <motion.div
                        initial={{ height: 'auto' }}
                        animate={{ height: isOpen ? '0px' : 'auto' }}
                        transition={{ duration: 0.3 }}
                        className='grid gap-2 max-h-50 overflow-y-auto rounded-2xl'
                    >
                        <motion.div
                            initial={{ opacity: 0, x: 10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.3 }}
                            className='w-[40px] mb-1'
                        >
                            <TbGhost2 className='text-gray-500 mx-auto' size={25}/>
                            <p className='text-gray-500 text-xs text-center mt-1'>No</p>
                        </motion.div>
                    </motion.div>
                )}
            </div>
        </>
    );
}