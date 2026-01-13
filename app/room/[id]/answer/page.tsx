import AnswerPage from '@/components/pages/AnswerPage';
import { getDrawingsByRoom } from '@/app/room/[id]/drawing/action';

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
    const { id: roomId } = await params;
    const result = await getDrawingsByRoom(roomId);
    
    const drawings = (result.success && result.data) ? result.data : [];
    
    return <AnswerPage roomId={roomId} drawings={drawings} />;
}