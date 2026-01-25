"use client";

import { useEffect, useState } from 'react';
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
import { TbArrowLeft, TbArrowRight, TbArrowUpRight, TbGhost2 } from 'react-icons/tb';
import { z } from 'zod';
import CreateRoomModal from '../organisms/lobby/CreateRoomModal';
import SetUserModal from '../organisms/lobby/SetUserModal';

const forbiddenChars = /[<>&\/\\'"]/;
const roomNameSchema = z.string().max(10).refine((val) => !forbiddenChars.test(val), {
    message: 'ルーム名に使用できない文字が含まれています。',
});

export default function LobbyPage({ rooms }: { rooms: Room[] }) {
    const [loading, setLoading] = useState(false);
    const username = getUsername();
    const [roomsList, setRoomsList] = useState<Room[]>(rooms);
    const router = useRouter();
    const [user, setUser] = useState(username || '');
    const [nameError, setNameError] = useState<string>('');
    const [searchName, setSearchName] = useState('');
    const [searchQuery, setSearchQuery] = useState(searchName);
    const [searchError] = useState<string>('');
    const { setLocalRoom } = historyLocalRoom();
    const [roomName, setRoomName] = useState<string>('');
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [roomError, setRoomError] = useState<string>('');
    const [isSetUserModal, setIsSetUserModal] = useState<boolean>(!username);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [isPaging, setIsPaging] = useState<boolean>(false);
    const itemsPerPage = 10;
    const [createRoomData, setCreateRoomData] = useState<CreateRoom>({
        level: 'normal',
        genre: 'ランダム',
        username: user,
        roomName: roomName
    });

    const handleCreateRoom = () => {
        if (!user) {
            setNameError('ユーザー名は必須です');
            return;
        }

        setIsOpen(true);
    }

    const createRoom = async () => {
        const isValid = validateRoomName(createRoomData.roomName);
        const sanitizedRoomName = DOMPurify.sanitize(createRoomData.roomName);

        if (!sanitizedRoomName) {
            setRoomError('ルーム名は必須です');
            return;
        } else if (!isValid) {
            setRoomError('ルーム名は10文字以内です。');
            return;
        } else {
            setRoomError('');
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

    const validateRoomName = (name: string) => {
        const parseResult = roomNameSchema.safeParse(name);
        return parseResult.success;
    }

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            setSearchQuery(searchName);
            // デバウンス後はページ番号を1にリセット
            setCurrentPage(1);
        }, 300);
        return () => clearTimeout(delayDebounceFn);
    }, [searchName]);

    useEffect(() => {
        // 初回ユーザー生成
        generateUser();
    }, []);


    useEffect(() => {
        const fetchRooms = async () => {
            setIsPaging(true);
            const res = await getRoomByPageSearch(currentPage, itemsPerPage, searchQuery);
            if (res.success && res.data) {
                setRoomsList(res.data);
            }
            setIsPaging(false);
        };
        fetchRooms();

        const subscription = supabase
            .channel('public:rooms')
            .on(
                'postgres_changes',
                { event: 'INSERT', schema: 'public', table: 'rooms' },
                () => {
                    fetchRooms();
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(subscription);
        }
    }, [currentPage, searchQuery]);

    return (
        <>
            {/* <BgObject /> */}
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
                        <div>
                            <Button
                                icon={<span className="text-xl font-bold">+</span>}
                                value='ルームを作成'
                                onClick={handleCreateRoom}
                                disabled={loading}
                            />
                        </div>
                    </Card>

                    <Card className='mb-4'>
                        <div className='mb-2'>
                            <label htmlFor="username" className='font-semibold text-gray-700'>ルーム検索</label>
                        </div>
                        <div className='mb-5'>
                            <Input
                                name="search"
                                value={searchName}
                                onChange={(e) => { 
                                    const isValid = validateText(e.target.value).success;
                                    if (isValid) {
                                        setSearchName(e.target.value);
                                    }
                                 }}
                                placeholder="検索したいルーム名を入力してください"
                                className={`w-full ${searchError ? 'border-red-500 border-2' : ''}`}
                            />
                        </div>
                        <div className='mb-2'>
                            <label htmlFor="username" className='font-semibold text-gray-700'>参加可能なルーム</label>
                        </div>
                        <div className="space-y-4">
                            {rooms.length === 0 ? (
                                <p className="text-gray-500">まだルームがありません</p>
                            ) : (
                                <div className="sm:grid sm:grid-cols-2 gap-3">
                                    {roomsList.length > 0 ? roomsList.map((room, index) => (
                                        <motion.div
                                            key={room.id}
                                            initial={{ opacity: 0, y: 40 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ duration: 0.4, ease: "easeOut", delay: index * 0.1 }}
                                            className="relative border border-yellow-500 bg-white/50 mb-4 border-3 rounded-3xl p-4 hover:shadow-md transition-shadow cursor-pointer"
                                            onClick={() => handleIntoRoom({ roomId: room.id })}
                                        >
                                            <div className="flex justify-between items-center">
                                                <TbArrowUpRight className="text-yellow-600  text-xl absolute right-3 top-3" />
                                                <div className='overflow-hidden text-ellipsis whitespace-nowrap'>
                                                    <label className="block text-gray-700 text-xs">ルーム名</label>
                                                    <h3 className='font-semibold text-sm truncate'>{room.room_name}</h3>
                                                    <p className="font-mono text-sm text-gray-600 text-xs truncate">作成者：{room.created_by_name}</p>
                                                </div>
                                            </div>
                                        </motion.div>
                                    )) : (
                                        <div className='py-5 text-center col-span-2'>
                                            <TbGhost2 className="text-gray-400 mx-auto mb-2" size={50} />
                                            <p className="text-gray-500">該当するルームが見つかりません。</p>
                                        </div>
                                    )}
                                    {/* ページネーション */}
                                    <div className="flex justify-center space-x-4 mt-4 col-span-2">
                                        <Button
                                            icon={<TbArrowLeft size={20} />}
                                            onClick={() => {
                                                if (currentPage > 1 && !isPaging) {
                                                    setIsPaging(true);
                                                    setCurrentPage(prev => prev - 1);
                                                }
                                            }}
                                            disabled={currentPage === 1 || isPaging}
                                            className='disabled:opacity-50 disabled:cursor-not-allowed'
                                        />
                                        <motion.div
                                            className="flex font-bold border-3 border-dotted border-yellow-600 items-center bg-yellow-400 px-4 rounded"
                                        >{currentPage}</motion.div>
                                        <Button
                                            icon={<TbArrowRight size={20} />}
                                            onClick={() => {
                                                if (!isPaging) {
                                                    setIsPaging(true);
                                                    setCurrentPage(prev => prev + 1);
                                                }
                                            }}
                                            disabled={roomsList.length < itemsPerPage || isPaging}
                                            className='disabled:opacity-50 disabled:cursor-not-allowed'
                                        />
                                    </div>
                                </div>
                            )}
                        </div>
                    </Card>
                </div>
            </div>
            {isOpen && (
                <CreateRoomModal
                    isOpen={isOpen}
                    roomName={roomName}
                    roomError={roomError}
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
        </>
    );
}
