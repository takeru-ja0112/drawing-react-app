import LobbyPage from '@/components/pages/LobbyPage';
import { getRooms } from './action';
import type { Room } from '@/type/roomType';
import { Suspense } from 'react';

export default async function Page() {
    // Server Actionsを呼び出し
    const result = await getRooms();
    const rooms: Room[] = result.success ? result.data as Room[] : [];

    return (
        <>
            <LobbyPage rooms={rooms} />
        </>
    )
}

export const dynamic = 'force-dynamic';