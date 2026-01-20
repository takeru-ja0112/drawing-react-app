"use client";

import { setStatusRoom } from '@/app/room/[id]/action';
import { isCheckAnswer, setdbAnswer } from '@/app/room/[id]/answer/action';
import Button from '@/components/atoms/Button';
import Card from '@/components/atoms/Card';
import Modal from '@/components/organisms/Modal';
import { usePresence } from '@/hooks/usePresence';
import { getOrCreateUser, type UserInfo } from '@/lib/user';
import { motion } from 'motion/react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import { IconContext } from 'react-icons';
import { TbBallBowling, TbPencil } from 'react-icons/tb';
import BgObject from '../organisms/BgObject';

export default function RoomPage({ title }: { title: string }) {
    const params = useParams();
    const roomId = params.id as string;
    const user : UserInfo = (getOrCreateUser());
    const { users } = usePresence(roomId, user.id, user.username);
    const router = useRouter();
    const [isAnswerModalOpen, setIsAnswerModalOpen] = useState(false);

    const handleCheckAnswer = async () => {
        const { success, data: isAnswerer } = await isCheckAnswer(roomId);

        if (success && isAnswerer) {
            router.push(`/room/${roomId}/answer`);
        } else {
            setIsAnswerModalOpen(true);
        }
    }
    const handleSetAnswer = async () => {
        const userId = localStorage.getItem('drawing_app_user_id');
        if (!userId) return;
        // 回答者として登録

        const result = await setdbAnswer(roomId, userId); // 'current-user-id'は実際のユーザーIDに置き換えてください
        if (!result.success) {
            // console.error('Failed to set answerer:', result.error);
        }
        router.push(`/room/${roomId}/answer`);
    }

    // useEffect(() => {
    //     const userInfo = getOrCreateUser();

    //     setUser(userInfo);
    // }, []);

    return (
        <div>
            <BgObject />
            <div className="w-full p-8">
                <div className="max-w-lg mx-auto">
                    <div className="mb-6 text-center">
                        <h2 className="text-lg text-gray-500 font-semibold mb-2">ルーム名</h2>
                        <p className="text-gray-900 font-bold break-all">{title}</p>
                    </div>
                    <Card className="mb-4 p-5 bg-gray-100 rounded-3xl">
                        <div className="mb-6">
                            <h2 className="text-lg text-gray-500 font-semibold mb-2">参加者</h2>
                            {users.length > 0 ? (
                                // <ul>
                                <div className='grid grid-cols-3 gap-2'>
                                    {users.map((user, index) => (
                                        <motion.div
                                            initial={{ opacity: 0, x: 10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: index * 0.2 }}
                                            key={index}
                                        >
                                            <div className='w-full p-2 bg-yellow-400 rounded-sm text-center font-bold text-xs whitespace-nowrap overflow-hidden text-ellipsis'>
                                                {user.user_name}
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                                // </ul>
                            ) : (
                                <p className="text-gray-500">
                                    参加者がいません。
                                </p>
                            )}
                        </div>
                        <div className="text-center">
                            <IconContext.Provider value={{ size: '1.5em' }}>
                                {/* 書く人用の説明 */}
                                <Card className="mb-4">
                                    <div className='my-4'>
                                        <p>
                                            <span className='font-bold'>Drawer</span>はお題を描こう
                                        </p>
                                    </div>

                                    <Link href={`/room/${roomId}/drawing`}>
                                        <Button value="Drawページへ" icon={<TbPencil />} />
                                    </Link>
                                </Card>

                                {/* 回答者用の説明 */}
                                <Card className="mb-4">
                                    <div className='my-4'>
                                        <p>
                                            <span className='font-bold'>Answer</span>はDrawerの描いた絵を見てお題を当てよう
                                        </p>
                                    </div>

                                    <Button value="Answerページへ" icon={<TbBallBowling />} onClick={handleCheckAnswer} />
                                </Card>
                            </IconContext.Provider>
                        </div>
                    </Card>
                </div>
            </div>
            {isAnswerModalOpen && <Modal
                isOpen={isAnswerModalOpen}
                onClose={() => setIsAnswerModalOpen(false)}
            >
                <div className="p-4 text-center">
                    <h2 className="text-2xl font-bold text-gray-500 mb-4">確認</h2>
                    <p className="mb-4 font-bold">
                        まだAnswerが決まっていません<br />
                        あなたがAnswerになりますか？
                    </p>
                    <Button value="いいえ" onClick={() => setIsAnswerModalOpen(false)} />
                    <Button value="はい" onClick={() => { handleSetAnswer(); setStatusRoom(roomId, 'DRAWING'); setIsAnswerModalOpen(false); }} className="ml-4" />
                </div>
            </Modal>
            }
        </div>
    );
}
