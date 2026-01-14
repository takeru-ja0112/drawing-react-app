"use client";

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import Button from '@/components/atoms/Button';
import { setUsername, getUsername } from '@/lib/user';
import type { Room } from '@/type/roomType';
import { generateUser } from '@/lib/user';
import Header from '@/components/organisms/Header';
import Modal from '@/components/organisms/Modal';

export default function LobbyPage({ rooms }: { rooms: Room[] }) {
    const [loading, setLoading] = useState(false);
    const username = getUsername();
    console.log('Retrieved username:', username);
    const router = useRouter();
    const [user, setUser] = useState(username || '');
    const [isUserModal, setIsUserModal] = useState(false);

    const createRoom = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/rooms', {
                method: 'POST',
            });
            const data = await res.json();

            if (data.id) {
                router.push(`/room/${data.id}`);
            }
        } catch (error) {
            console.error('Failed to create room:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleIsusername = ({ roomId }: { roomId: string }) => {
        if (!user) {
            setIsUserModal(true);
            return false;
        }
        router.push(`/room/${roomId}`);
    }

    useEffect(() => {
        // 初回ユーザー生成
        generateUser();
    }, []);

    return (
        <>
            <Header />
            <div className="min-h-screen p-8 bg-gray-200">
                <div className="max-w-lg mx-auto">

                    {/* ユーザー名の管理 */}
                    <div className='my-2'>
                        <label className="block mb-2 font-semibold" htmlFor="username">ユーザー名</label>
                        <input
                            type="text"
                            id="username"
                            name="username"
                            value={user}
                            onChange={(e) => {
                                const newName = e.target.value;
                                setUser(newName);
                                setUsername(newName);
                            }}
                            placeholder='名前を入力してください'
                            className="border rounded-lg p-2 w-full"
                        />
                    </div>

                    <div className="mb-8">
                        <Button
                            value={loading ? '作成中...' : 'ルームを作成'}
                            onClick={createRoom}
                            disabled={loading}
                        />
                    </div>

                    <div className="space-y-4">
                        <h2 className="text-xl font-semibold">参加可能なルーム</h2>

                        {rooms.length === 0 ? (
                            <p className="text-gray-500">まだルームがありません</p>
                        ) : (
                            <div className="grid gap-4">
                                {rooms.map((room) => (
                                    <div
                                        key={room.id}
                                        className="bg-white border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                                        onClick={() => handleIsusername({ roomId: room.id })}
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

                {/* 名前入力モーダル */}
                {isUserModal && (
                    <Modal isOpen={isUserModal} onClose={() => setIsUserModal(false)}>
                        <h2 className="text-xl font-semibold mb-4">ユーザー名を入力してください</h2>
                        <input
                            type="text"
                            value={user}
                            onChange={(e) => setUser(e.target.value)}
                            placeholder="名前を入力"
                            className="border rounded-lg p-2 w-full mb-4"
                        />
                        <div className="flex justify-end">
                            <button
                                onClick={() => setIsUserModal(false)}
                                className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg mr-2"
                            >
                                キャンセル
                            </button>
                            <Button
                                onClick={() => {
                                    if (user) {
                                        setUsername(user);
                                        setIsUserModal(false);
                                    } else {
                                        alert('ユーザー名を入力してください');
                                    }
                                }}
                                className=" px-4 py-2 rounded-lg"
                                value='保存'
                            />
                        </div>
                    </Modal>
                )
                }
            </div>
        </>
    );
}
