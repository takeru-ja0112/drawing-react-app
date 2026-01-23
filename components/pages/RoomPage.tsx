"use client";

import { changeRoomTheme, resetDrawingData, setStatusRoom } from '@/app/room/[id]/action';
import { isCheckAnswer, setdbAnswer } from '@/app/room/[id]/answer/action';
import Button from '@/components/atoms/Button';
import Card from '@/components/atoms/Card';
import Modal from '@/components/organisms/Modal';
import StatusBar from '@/components/organisms/StatusBat';
import { useModalContext } from '@/hooks/useModalContext';
import { supabase } from '@/lib/supabase';
import type { RoomSettingType } from '@/type/roomType';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { IconContext } from 'react-icons';
import { TbBallBowling, TbPencil } from 'react-icons/tb';
import AccessUser from '../organisms/AccessUser';
import BgObject from '../organisms/BgObject';
import RoomSetting from '../organisms/RoomSetting';

export default function RoomPage({ title }: { title: string }) {
    const params = useParams();
    const roomId = params.id as string;
    const router = useRouter();
    const [isAnswerModalOpen, setIsAnswerModalOpen] = useState(false);
    const [status, setStatus] = useState<string>('WAITING');
    const [roomSetting, setRoomSetting] = useState<RoomSettingType>({ level: "normal", genre: "ランダム" });
    const { open, modalType, close } = useModalContext();

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

    const handleChangeRoomTheme = async () => {
        const result = await changeRoomTheme({
            roomId,
            roomSetting
        });
        if(!result.success) {
            console.error('Failed to change room theme:', result.error);
            return;
        }
        close();
    }

    useEffect(() => {
        const fetchRoomStatus = async () => {
            const { data, error } = await supabase
                .from('rooms')
                .select('status')
                .eq('id', roomId)
                .single();

            if (error) {
                console.error('Failed to fetch room status:', error);
                return;
            }

            if (data) {
                setStatus(data.status);
            }
        };

        fetchRoomStatus();

        const subscription = supabase
            .channel('public:rooms')
            .on(
                'postgres_changes',
                { event: 'UPDATE', schema: 'public', table: 'rooms', filter: `id=eq.${roomId}` },
                (payload) => {
                    const newStatus = payload.new.status;
                    setStatus(newStatus);
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(subscription);
        };
    },[])

    return (
        <div>
            <BgObject />
            <div className="w-full p-8">
                <div className="max-w-lg mx-auto">
                    <div className="mb-6 text-center">
                        <h2 className="text-lg text-gray-500 font-semibold mb-2">ルーム名</h2>
                        <p className="text-gray-900 font-bold break-all">{title}</p>
                    </div>
                    <StatusBar status={status}></StatusBar>
                    <AccessUser roomId={roomId} />
                    <Card className="mb-4 pb-1 bg-gray-100 rounded-3xl">
                        <Button
                            onClick={()=> open('roomSetting')}
                            value='お題を変更する'
                            className='mb-4 w-full'
                        />
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
                    <Button value="はい" onClick={() => {
                        resetDrawingData(roomId);
                        handleSetAnswer(); 
                        setStatusRoom(roomId, 'DRAWING');
                        setIsAnswerModalOpen(false);
                    }} 
                    className="ml-4" />
                </div>
            </Modal>
            }
            {modalType === 'roomSetting' && (
                <Modal isOpen={true} onClose={close} className='w-full'>
                    <div className="p-4">
                        <h2 className="text-2xl font-bold mb-4 text-center">ルーム設定</h2>
                        <RoomSetting setRoomData={setRoomSetting} />
                        <div className='grid grid-cols-2 gap-3 mt-2'>
                            <Button
                                onClick={() => {
                                    close();
                                }}
                                value="閉じる"
                                className="w-full mt-4"
                            />
                            <Button
                                onClick={handleChangeRoomTheme}
                                value="変更する"
                                className="w-full mt-4"
                            />
                        </div>
                    </div>
                </Modal>
            )}
        </div>
    );
}
