"use client";

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { usePresence } from '@/hooks/usePresence';
import { getOrCreateUser, type UserInfo } from '@/lib/user';
import Button from '@/components/atoms/Button';
import Link from 'next/link';

type Room = {
    id: string;
    status: string;
    current_theme: string | null;
    answerer_id: string | null;
};

export default function RoomPage() {
    const params = useParams();
    const roomId = params.id as string;
    const [room, setRoom] = useState<Room | null>(null);
    const [user, setUser] = useState<UserInfo>({ id: '', username: '' });
    const { users } = usePresence(roomId, user.id, user.username);

    useEffect(() => {
        // ユーザー情報を取得または生成
        // const userInfo = getOrCreateUser();
        const userInfo = getOrCreateUser();

        setUser(userInfo);
        console.log('ユーザー情報:', userInfo);
    }, []);

    useEffect(() => {
        const fetchRoom = async () => {
            const res = await fetch(`/api/rooms/${roomId}`);
            const data = await res.json();
            setRoom(data);
        };

        fetchRoom();
    }, [roomId]);

    if (!room) {
        return <div className="p-8">読み込み中...</div>;
    }

    return (
        <div className="min-h-screen p-8">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-2xl font-bold mb-4">ルーム: {roomId.slice(0, 8)}</h1>
                {users.length > 0 && (
                    <div className="mb-4">
                        <h2 className="text-lg font-semibold mb-2">参加者:</h2>
                        <ul>
                            {users.map((user, index) => (
                                <li key={index}>
                                    <div className='w-full p-2 bg-gray-400 my-2 rounded-full text-center font-bold'>
                                        {user.user_name}
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                <div className="mb-4">
                    <p>ステータス: <span className="font-semibold">{room.status}</span></p>
                    {room.current_theme && <p>お題: {room.current_theme}</p>}
                </div>

                <div className="border rounded-lg p-8 text-center text-gray-500">
                    <Link href={`/room/${roomId}/drawing`}>
                        <Button>
                            書く人に設定
                        </Button>
                    </Link>
                    <Link href={`/room/${roomId}/answering`}>
                        <Button>
                            回答者に設定
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    );
}
