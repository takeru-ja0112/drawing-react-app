import LobbyPage from '@/components/pages/LobbyPage';
import type { Room } from '@/type/roomType';
import { getRoomByPageSearch } from './action';

export default async function Page() {
    // // Server Actionsを呼び出し
    // const roomResult = await getRoomByPageSearch(1, 10, '');
    // const rooms: Room[] = roomResult.success ? roomResult.data as Room[] : [];

    //遅延処理
    await new Promise((resolve) => setTimeout(resolve, 1000));

    return (
        <>
            <LobbyPage />
        </>
    )
}

// export const dynamic = 'force-dynamic';