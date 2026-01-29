"use client";

import { use, useEffect, useState } from 'react';
// サニタイズ用
import { createRoomByUsername, getRoomByPageSearch } from '@/app/lobby/action';
import Button from '@/components/atoms/Button';
import Card from '@/components/atoms/Card';
import Input from '@/components/atoms/Input';
import historyLocalRoom from '@/lib/hitoryLocalRoom';
import { supabase } from '@/lib/supabase';
import { generateUser, getUsername, setUsernameSchema } from '@/lib/user';
import { validateText } from '@/lib/validation';
import type { CreateRoom, Room } from '@/type/roomType';
import DOMPurify from 'dompurify';
import { motion } from 'motion/react';
import { useRouter } from 'next/navigation';
import { TbArrowLeft, TbArrowRight, TbArrowUpRight, TbGhost2, TbSearch } from 'react-icons/tb';
import { z } from 'zod';
import CreateRoomModal from '@/components/organisms/lobby/CreateRoomModal';
import SetUserModal from '@/components/organisms/lobby/SetUserModal';
import { setRoomSchema } from '@/lib/room';
import Link from 'next/link';
import SearchRoomModal from '@/components/organisms/lobby/SearchRoomModal';
import { getRoom } from '@/app/lobby/action';

export default function LobbyPage() {
    const [loading, setLoading] = useState(false);
    const username = getUsername();
    const [latestRoom, setLatestRoom] = useState<Room>({} as Room);
    const router = useRouter();
    const [user, setUser] = useState(username || '');
    const [nameError, setNameError] = useState<string>('');
    const { setLocalRoom, getLocalRoom } = historyLocalRoom();
    const [roomName, setRoomName] = useState<string>('');
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [roomError, setRoomError] = useState<string>('');
    const [isSetUserModal, setIsSetUserModal] = useState<boolean>(!username);
    const [createRoomData, setCreateRoomData] = useState<CreateRoom>({
        level: 'normal',
        genre: 'ランダム',
        username: user,
        roomName: roomName
    });
    const [isOpenSearchRoom, setIsOpenSearchRoom] = useState<boolean>(false);

    // userが変わったらcreateRoomData.usernameも更新
    useEffect(() => {
        setCreateRoomData(prev => ({
            ...prev,
            username: user
        }));
    }, [user]);

    const createRoom = async () => {
        const result = setRoomSchema({
            roomName: createRoomData.roomName,
            setRoomError,
            setCreateRoomData
        });
        if (!result || !result.success) {
            return;
        }

        setLoading(true);
        try {
            const result = await createRoomByUsername(createRoomData);
            if (result.success && result.data) {
                const roomId = result.data.id;
                setLocalRoom(roomId);
                router.push(`/room/${roomId}`);
            } else {
                console.error('Failed to create room:', result.error);
                setRoomError('ルームの作成に失敗しました。');
            }
        } catch (error) {
            console.error('Error create room:', error);
        } finally {
            setLoading(false);
        }
    }

    const handleIntoRoom = ({ roomId }: { roomId: string }) => {
        if (!user) {
            setNameError('ルームに参加するにはユーザー名が必要です');
            return false;
        }
        setLocalRoom(roomId);
        router.push(`/room/${roomId}`);
    }

    useEffect(() => {
        const latestRoomID = getLocalRoom();

        if (latestRoomID) {
            const fetchLatestRoom = async () => {
                const res = await getRoom(latestRoomID);
                if (res.success && res.data) {
                    setLatestRoom(res.data);
                }
            };
            fetchLatestRoom();
        }
    }, []);

    // useEffect(() => {
    //     const delayDebounceFn = setTimeout(() => {
    //         setSearchQuery(searchName);
    //         // デバウンス後はページ番号を1にリセット
    //         setCurrentPage(1);
    //     }, 300);
    //     return () => clearTimeout(delayDebounceFn);
    // }, [searchName]);

    // useEffect(() => {
    //     // 初回ユーザー生成
    //     generateUser();
    // }, []);


    // useEffect(() => {
    //     const fetchRooms = async () => {
    //         setIsPaging(true);
    //         const res = await getRoomByPageSearch(currentPage, itemsPerPage, searchQuery);
    //         if (res.success && res.data) {
    //             setRoomsList(res.data);
    //         }
    //         setIsPaging(false);
    //     };
    //     fetchRooms();

    //     const subscription = supabase
    //         .channel('public:rooms')
    //         .on(
    //             'postgres_changes',
    //             { event: 'INSERT', schema: 'public', table: 'rooms' },
    //             () => {
    //                 fetchRooms();
    //             }
    //         )
    //         .subscribe();

    //     return () => {
    //         supabase.removeChannel(subscription);
    //     }
    // }, [currentPage, searchQuery]);

    return (
        <>
            {/* <BgObject /> */}
            <Link href={`/`} className='z-50 fixed top-13 left-2 text-gray-500 hover:text-gray-700 transition duration-300 p-2 rounded-full'>
                <TbArrowLeft size='2em' />
            </Link>
            <div className="p-8">
                <div className="max-w-lg mx-auto">

                    <Card className='mb-4'>
                        {/* ユーザー名の管理 */}
                        <div className='mb-2'>
                            <label htmlFor="username" className='font-semibold text-gray-700'>ユーザー名</label>
                        </div>
                        <div className='my-2'>
                            <Input
                                name="username"
                                value={user}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                    setUsernameSchema({ name: e.target.value, setNameError, setUser });
                                }}
                                onBlur={() => {
                                    setNameError('');
                                    if (!user) {
                                        setNameError('ユーザー名は必須です');
                                    }
                                }}
                                placeholder="ユーザー名を入力してください"
                                className={`w-full ${nameError ? 'border-red-500 border-2' : ''}`}
                            />
                        </div>
                        {nameError && (
                            <div className="mb-2">
                                <p className="text-red-500 font-semibold text-sm">{nameError}</p>
                            </div>
                        )}
                    </Card>

                    <Card className='mb-4'>
                        <div className='mb-2'>
                            <h2 className='font-semibold text-gray-700'>ルーム</h2>
                        </div>
                        <div className='grid gap-3 sm:grid-cols-2 mb-4'>
                            <Button
                                icon={<span className="text-xl font-bold">+</span>}
                                value='ルームをつくる'
                                onClick={() => {
                                    if (!user) {
                                        setNameError('ルームを作成するにはユーザー名が必要です。');
                                        return;
                                    }
                                    setIsOpen(true)
                                }}
                                disabled={loading}
                            />
                            <Button
                                icon={<TbSearch size={20} />}
                                value='ルームをさがす'
                                onClick={() => {
                                    if (!user) {
                                        setNameError('ルームを探すにはユーザー名が必要です。');
                                        return false;
                                    } else {
                                        setIsOpenSearchRoom(true)
                                    }
                                }}
                                disabled={loading}
                            />
                        </div>
                        <div className='mb-2'>
                            <h2 className='font-semibold text-gray-700'>最後に入ったルーム</h2>
                        </div>
                        {latestRoom && latestRoom.id ? (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3 }}
                                className='cursor-pointer mb-4'
                                onClick={() => handleIntoRoom({ roomId: latestRoom.id })}
                                whileHover={{ scale: 1.02 }}
                            >
                                <div className='relative p-3 border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden'>
                                    <span className='absolute -right-8 -top-8 w-15 h-15 bg-yellow-500 rotate-45'></span>
                                    <div className='w-full font-bold'>
                                        <h3 className='text-lg'>{latestRoom.room_name}</h3>
                                        <div className='text-sm text-gray-500'>
                                            ID: <span className='font-semibold'>{latestRoom.short_id}</span>
                                        </div>
                                    </div>
                                    <hr className='border-gray-300' />
                                    <div className='text-gray-500 text-sm mt-2'>
                                        作成者: {latestRoom.created_by_name || '不明'}<br />
                                        作成日時: {new Date(latestRoom.created_at).toLocaleString()}
                                    </div>
                                </div>
                            </motion.div>
                        ) : (
                            <div>
                                <TbGhost2 size={40} className='mx-auto text-gray-300' />
                                <div className='text-center text-gray-400 font-semibold mt-2'>最後に入ったルームはありません</div>
                            </div>
                        )}
                        <div className='mb-2'>
                            <h2 className='font-semibold text-gray-700'>自分がつくったルーム</h2>
                        </div>
                    </Card>
                </div>
            </div>
            {isOpen && (
                <CreateRoomModal
                    isOpen={isOpen}
                    roomName={roomName}
                    roomError={roomError}
                    setRoomError={setRoomError}
                    loading={loading}
                    createRoomData={createRoomData}
                    setCreateRoomData={setCreateRoomData}
                    setIsOpen={setIsOpen}
                    setRoomName={setRoomName}
                    createRoom={createRoom}
                    className='w-full'
                />
            )}

            {isSetUserModal && (
                <SetUserModal
                    isSetUserModal={isSetUserModal}
                    user={user}
                    nameError={nameError}
                    loading={loading}
                    setUser={setUser}
                    setNameError={setNameError}
                    setIsSetUserModal={setIsSetUserModal}
                    className='w-full'
                />
            )}

            {isOpenSearchRoom && (
                <SearchRoomModal
                    isOpen={isOpenSearchRoom}
                    onClose={() => setIsOpenSearchRoom(false)}
                />
            )}
        </>
    );
}
