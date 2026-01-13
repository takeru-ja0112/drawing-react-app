"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Button from '@/components/atoms/Button';

type Room = {
  id: string;
  status: string;
  current_theme: string | null;
  created_at: string;
};

export default function RoomListPage() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const fetchRooms = async () => {
    const res = await fetch('/api/rooms');
    const data = await res.json();
    setRooms(data);
  };

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

  useEffect(() => {
    fetchRooms();
  }, []);

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Minimalist Drawer</h1>
        
        <div className="mb-8">
          <button 
            onClick={createRoom}
            disabled={loading}
            className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 disabled:opacity-50"
          >
            {loading ? '作成中...' : 'ルームを作成'}
          </button>
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
                  className="border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => router.push(`/room/${room.id}`)}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-mono text-sm text-gray-600">ID: {room.id.slice(0, 8)}</p>
                      <p className="text-sm">
                        ステータス: <span className="font-semibold">{room.status}</span>
                      </p>
                      {room.current_theme && (
                        <p className="text-sm">お題: {room.current_theme}</p>
                      )}
                    </div>
                    <Button>
                      参加
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
