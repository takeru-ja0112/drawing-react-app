import RoomPage from '@/components/pages/RoomPage';
import { isCheckAnswer } from './answer/action';

export default async function Page({params } : { params: Promise<{ id: string }> }) {
    const { id:roomId } = await params;
    const { success, data } = await isCheckAnswer(roomId);
    console.log('Is answerer set:', success, data);


    return <RoomPage />
}
