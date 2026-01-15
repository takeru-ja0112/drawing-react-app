"use client";

import { useState, useEffect, use } from 'react';
// サニタイズ用
import DOMPurify from 'dompurify';
import { useRouter } from 'next/navigation';
import Button from '@/components/atoms/Button';
import { setUsername, getUsername } from '@/lib/user';
import type { Room } from '@/type/roomType';
import { generateUser } from '@/lib/user';
import Header from '@/components/organisms/Header';
import { z } from 'zod';
import { createRoomByUsername } from '@/app/lobby/action';
import Input from '@/components/atoms/Input';
import historyLocalRoom from '@/lib/hitoryLocalRoom';
import Modal from '@/components/organisms/Modal';

const forbiddenChars = /[<>&\/\\'"]/;
const usernameSchema = z.string().max(20).refine((val) => !forbiddenChars.test(val), {
    message: 'ユーザー名に使用できない文字が含まれています。',
});
const roomNameSchema = z.string().max(30).refine((val) => !forbiddenChars.test(val), {
    message: 'ルーム名に使用できない文字が含まれています。',
});

export default function LobbyPage({ rooms }: { rooms: Room[] }) {
    const [loading, setLoading] = useState(false);
    const username = getUsername();
    const router = useRouter();
    const [user, setUser] = useState(username || '');
    const [nameError, setNameError] = useState<string>('');
    const [searchName, setSearchName] = useState('');
    const [searchError, setSearchError] = useState<string>('');
    const { setLocalRoom } = historyLocalRoom();
    const [roomName, setRoomName] = useState<string>('');
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [roomError, setRoomError] = useState<string>('');

    const handleCreateRoom = () => {
        if (!user) {
            setNameError('ユーザー名は必須です');
            return;
        }

        setIsOpen(true);
    }

    const filteredRooms = rooms.filter((room) =>
        room.room_name?.toLowerCase().includes(searchName.toLowerCase())
    );

    const createRoom = async () => {
        const isValid = validateRoomName(roomName);
        const sanitizedRoomName = DOMPurify.sanitize(roomName);

        if (!sanitizedRoomName) {
            setRoomError('ルーム名は必須です');
            return;
        } else if (!isValid) {
            setRoomError('ルーム名は30文字以内です。');
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
        const isValid = validateUsername(user);

        if (!user) {
            setNameError('ルームに参加するにはユーザー名が必要です');
            return false;
        }
        setLocalRoom(roomId);
        router.push(`/room/${roomId}`);
    }

    const setUsernameSchema = (name: string) => {
        setNameError('');
        const isValid = validateUsername(name);

        if (isValid) {
            setUser(name);
            setUsername(name);
        } else {
            setNameError('ユーザー名は20文字以内です。');
        }
    }

    const validateUsername = (name: string) => {
        const parseResult = usernameSchema.safeParse(name);
        return parseResult.success;
    }

    const validateRoomName = (name: string) => {
        const parseResult = roomNameSchema.safeParse(name);
        return parseResult.success;
    }

    useEffect(() => {
        // 初回ユーザー生成
        generateUser();
    }, []);

    return (
        <>
            <Header />
            <div className="p-8">
                <div className="max-w-lg mx-auto">

                    <div className='bg-white p-4 mb-4 rounded-xl shadow-md'>
                        {/* ユーザー名の管理 */}
                        <div className='mb-2'>
                            <label htmlFor="username" className='font-semibold text-gray-700'>ユーザー名</label>
                        </div>
                        <div className='my-2'>
                            <Input
                                name="username"
                                value={user}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                    setUsernameSchema(e.target.value)
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
                                value={loading ? '作成中...' : 'ルームを作成'}
                                onClick={handleCreateRoom}
                                disabled={loading}
                            />
                        </div>
                    </div>

                    <div className='bg-white p-4 rounded-xl shadow-md'>
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
                                            className="border border-gray-400 border-3 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                                            onClick={() => handleIntoRoom({ roomId: room.id })}
                                        >
                                            <div className="flex justify-between items-center">
                                                <div>
                                                    <label className="block text-gray-700 text-sm">ルーム名</label>
                                                    <h3 className='font-semibold text-lg'>{room.room_name}</h3>
                                                    <p className="font-mono text-sm text-gray-600">作成者：{room.created_by_name}</p>
                                                </div>
                                                <Button value="参加" />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            {isOpen && (
                <Modal
                    isOpen={isOpen}
                    onClose={() => setIsOpen(false)}
                >
                    <p className="font-semibold mb-2 text-gray-700">ルーム名の入力</p>
                    <Input
                        value={roomName}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setRoomName(e.target.value)}
                        className='w-full'
                        placeholder='ルーム名を入力してください'
                    />
                    {roomError && (
                        <div className="mt-2">
                            <p className="text-red-500 font-semibold text-sm">{roomError}</p>
                        </div>
                    )}
                    <div className='flex space-x-2 mt-4'>
                        <Button
                            value='キャンセル'
                            onClick={() => setIsOpen(false)}
                            disabled={loading}
                        />
                        <Button
                            value={loading ? '作成中...' : 'ルームを作成'}
                            onClick={createRoom}
                            disabled={loading}
                        />
                    </div>
                </Modal>
            )}
        </>
    );
}
