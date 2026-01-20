import LobbyPage from '@/components/pages/LobbyPage';
import type { Room } from '@/type/roomType';
import { getRoomByPageSearch, getRooms } from './action';

export default async function Page() {
    // Server Actionsを呼び出し
    const result = await getRooms();
    const roomResult = await getRoomByPageSearch(1, 10, '');
    const rooms: Room[] = roomResult.success ? roomResult.data as Room[] : [];

    return (
        <>
            <LobbyPage rooms={rooms} />
        </>
    )
}

export const dynamic = 'force-dynamic';