"use client";

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { usePresence } from '@/hooks/usePresence';

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
    const { users } = usePresence(roomId, `user_${Math.floor(Math.random() * 1000)}`);

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
                                <li key={index}>{user.user_name}</li>
                            ))}
                        </ul>
                    </div>
                )}
                
                <div className="mb-4">
                    <p>ステータス: <span className="font-semibold">{room.status}</span></p>
                    {room.current_theme && <p>お題: {room.current_theme}</p>}
                </div>

                <div className="border rounded-lg p-8 text-center text-gray-500">
                    ゲーム機能は後ほど実装予定
                </div>
            </div>
        </div>
    );
}
