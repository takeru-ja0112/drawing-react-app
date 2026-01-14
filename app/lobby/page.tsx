import LobbyPage from '@/components/pages/LobbyPage';
import { getRooms } from './action';
import type { Room } from '@/type/roomType';

export default async function Page() {
    // Server Actionsを呼び出し
    const result = await getRooms();
    const rooms: Room[] = result.success ? result.data as Room[] : [];
    console.log('Lobby Page rooms:', rooms);

    return <LobbyPage rooms={rooms} />
}
