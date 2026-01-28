import RoomPage from '@/components/pages/RoomPage';
import { getInfoRoom } from './action';

export default async function Page({params } : { params: Promise<{ id: string }> }) {    
    const { id:roomId } = await params;
    const res = await getInfoRoom(roomId);
    const title = res.success && res.data ? res.data.room_name : '';
    const shortId = res.success && res.data ? res.data.short_id : '';

    return <RoomPage title={title} shortId={shortId} />
}
