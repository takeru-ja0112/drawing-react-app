"use client";

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import Button from '@/components/atoms/Button';
import { setUsername, getUsername } from '@/lib/user';
import type { Room } from '@/type/roomType';
import { generateUser } from '@/lib/user';
import Header from '@/components/organisms/Header';
import { z } from 'zod';
import { motion } from 'motion/react';
import { createRoom } from '@/app/lobby/action';
import Input from '@/components/atoms/Input';
import historyLocalRoom from '@/lib/hitoryLocalRoom';

const usernameSchema = z.string().max(20);

export default function LobbyPage({ rooms }: { rooms: Room[] }) {
    const [loading, setLoading] = useState(false);
    const username = getUsername();
    const router = useRouter();
    const [user, setUser] = useState(username || '');
    const [nameError, setNameError] = useState<string>('');
    const [searchName, setSearchName] = useState('');
    const [searchError, setSearchError] = useState<string>('');
    const { setLocalRoom } = historyLocalRoom();
    const [ roomError , setRoomError ] = useState<string>('');

    const handleCreateRoom = async () => {
        if (!user) {
            setNameError('ユーザー名は必須です');
            return;
        }

        setLoading(true);
        try {
            const result = await createRoom(user);
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
                            <label htmlFor="username" className='font-semibold'>ユーザー名</label>
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
                            {roomError && (
                                <div className="mt-2">
                                    <p className="text-red-500 font-semibold text-sm">{roomError}</p>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className='bg-white p-4 rounded-xl shadow-md'>
                        <div className='mb-2'>
                            <label htmlFor="username" className='font-semibold'>ルーム</label>
                        </div>
                        <div className='mb-5'>
                            <Input
                                name="search"
                                value={searchName}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchName(e.target.value)}
                                placeholder="検索名を入力してください"
                                className={`w-full ${searchError ? 'border-red-500 border-2' : ''}`}
                            />
                        </div>
                        <h2 className="text-md font-semibold text-gray-700">参加可能なルーム</h2>
                        <div className="space-y-4">
                            {rooms.length === 0 ? (
                                <p className="text-gray-500">まだルームがありません</p>
                            ) : (
                                <div className="grid gap-4">
                                    {rooms.map((room) => (
                                        <div
                                            key={room.id}
                                            className="border border-yellow-400 border-3 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                                            onClick={() => handleIntoRoom({ roomId: room.id })}
                                        >
                                            <div className="flex justify-between items-center">
                                                <div>
                                                    <p className="font-mono text-sm text-gray-600">ID: {room.id.slice(0, 8)}</p>
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
        </>
    );
}
