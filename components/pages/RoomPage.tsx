"use client";

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { usePresence } from '@/hooks/usePresence';
import { getOrCreateUser, type UserInfo } from '@/lib/user';
import Button from '@/components/atoms/Button';
import Link from 'next/link';
import Header from '@/components/organisms/Header';
import { TbPencil, TbBallBowling } from 'react-icons/tb';
import { IconContext } from 'react-icons';
import { motion } from 'motion/react';

type Room = {
    id: string;
    status: string;
    current_theme: string | null;
    answerer_id: string | null;
};

export default function RoomPage() {
    const params = useParams();
    const roomId = params.id as string;
    // const [room, setRoom] = useState<Room | null>(null);
    const [user, setUser] = useState<UserInfo>({ id: '', username: '' });
    const { users } = usePresence(roomId, user.id, user.username);

    useEffect(() => {
        // ユーザー情報を取得または生成
        // const userInfo = getOrCreateUser();
        const userInfo = getOrCreateUser();

        setUser(userInfo);
    }, []);

    return (
        <div>
            <Header />
            <div className="w-full p-8">
                <div className="max-w-lg mx-auto">
                    <div
                        className="mb-4 p-4 bg-gray-100 rounded-lg shadow-md border border-dotted border-gray-300 border-4"
                    >
                        <h2 className="text-lg text-gray-700 font-semibold mb-2">参加者</h2>
                        {users.length > 0 ? (
                            <ul>
                                {users.map((user, index) => (
                                    <motion.li
                                        initial={{ opacity: 0, x: 10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: index * 0.2 }}
                                        key={index}
                                    >
                                        <div className='w-full p-2 bg-amber-400 my-2 rounded-full text-center font-bold'>
                                            {user.user_name}
                                        </div>
                                    </motion.li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-gray-500">
                                参加者がいません。
                            </p>
                        )}
                    </div>
                    <div className="text-center">
                        <IconContext.Provider value={{ size: '1.5em' }}>
                            {/* 書く人用の説明 */}
                            <div className="mb-4 bg-white p-4 rounded-lg shadow-md">
                                <div className='my-4'>
                                    <p>
                                        <span className='font-bold'>Drawer</span>はお題を描こう
                                    </p>
                                </div>

                                <Link href={`/room/${roomId}/drawing`}>
                                    <Button value="Drawerになる" icon={<TbPencil />} />
                                </Link>
                            </div>

                            {/* 回答者用の説明 */}
                            <div className="mb-4 bg-white p-4 rounded-lg shadow-md">
                                <div className='my-4'>
                                    <p>
                                        <span className='font-bold'>Answer</span>はDrawerの描いた絵を見てお題を当てよう
                                    </p>
                                </div>

                                <Link href={`/room/${roomId}/answer`}>
                                    <Button value="Answerになる" icon={<TbBallBowling />} />
                                </Link>
                            </div>
                        </IconContext.Provider>
                    </div>
                </div>
            </div>
        </div>
    );
}
