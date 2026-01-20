"use client";

import { useEffect, useState } from 'react';
// サニタイズ用
import { createRoomByUsername, getRooms } from '@/app/lobby/action';
import Button from '@/components/atoms/Button';
import Card from '@/components/atoms/Card';
import Input from '@/components/atoms/Input';
import Loading from '@/components/atoms/Loading';
import historyLocalRoom from '@/lib/hitoryLocalRoom';
import { supabase } from '@/lib/supabase';
import { generateUser, getUsername, setUsernameSchema } from '@/lib/user';
import type { Room } from '@/type/roomType';
import DOMPurify from 'dompurify';
import { useRouter } from 'next/navigation';
import { z } from 'zod';
import BgObject from '../organisms/BgObject';
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
    const [searchError] = useState<string>('');
    const { setLocalRoom } = historyLocalRoom();
    const [roomName, setRoomName] = useState<string>('');
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [roomError, setRoomError] = useState<string>('');
    const [joinLoadingId, setJoinLoadingId] = useState<string | null>(null);
    const [isSetUserModal, setIsSetUserModal] = useState<boolean>(!username);

    const handleCreateRoom = () => {
        if (!user) {
            setNameError('ユーザー名は必須です');
            return;
        }

        setIsOpen(true);
    }

    const filteredRooms = roomsList.filter((room) =>
        room.room_name?.toLowerCase().includes(searchName.toLowerCase())
    );

    const createRoom = async () => {
        const isValid = validateRoomName(roomName);
        const sanitizedRoomName = DOMPurify.sanitize(roomName);

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
            const result = await createRoomByUsername(user, sanitizedRoomName);
            if (result.success && result.data) {
                const roomId = result.data.id;
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
        setJoinLoadingId(roomId);
        setLocalRoom(roomId);
        router.push(`/room/${roomId}`);
    }

    const validateRoomName = (name: string) => {
        const parseResult = roomNameSchema.safeParse(name);
        return parseResult.success;
    }

    useEffect(() => {
        // 初回ユーザー生成
        generateUser();
    }, []);

    useEffect(() => {
        // ルームリストの再取得
        const fetchRooms = async () => {
            const res = await getRooms();
            if (res.success && res.data) {
                setRoomsList(res.data);
            }
        }
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
    }, []);

    return (
        <>
            <BgObject />
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
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchName(e.target.value)}
                                placeholder="検索したいルーム名を入力してください"
                                className={`w-full ${searchError ? 'border-red-500 border-2' : ''}`}
                            />
                        </div>
                        <h2 className="text-md font-semibold text-gray-700">参加可能なルーム</h2>
                        <div className="space-y-4">
                            {rooms.length === 0 ? (
                                <p className="text-gray-500">まだルームがありません</p>
                            ) : (
                                <div className="grid gap-4">
                                    {filteredRooms.map((room) => (
                                        <div
                                            key={room.id}
                                            className=" border border-gray-400 border-3 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                                            onClick={() => handleIntoRoom({ roomId: room.id })}
                                        >
                                            <div className="flex justify-between items-center">
                                                <div>
                                                    <label className="block text-gray-700 text-sm">ルーム名</label>
                                                    <h3 className='font-semibold text-lg'>{room.room_name}</h3>
                                                    <p className="font-mono text-sm text-gray-600">作成者：{room.created_by_name}</p>
                                                </div>
                                                <Button
                                                    key={room.id}
                                                    value="参加"
                                                    icon={joinLoadingId === room.id ? <Loading /> : null}
                                                />
                                            </div>
                                        </div>
                                    ))}
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
                    setIsOpen={setIsOpen}
                    setRoomName={setRoomName}
                    createRoom={createRoom}
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
