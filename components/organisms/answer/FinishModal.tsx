import Modal from '@/components/organisms/Modal'
import Button from '@/components/atoms/Button';
import { resetRoomSettings, setStatusRoom } from '@/app/room/[id]/action';
import { useRouter } from 'next/navigation';

export default function FinishModal({ roomId}: { roomId: string; }) {
    const router = useRouter();

    return (
        <Modal isOpen={true}>
            <div className="p-6">
                <h2 className="text-2xl font-bold mb-4 text-center">お題を変更してルームに戻りますか？</h2>
                <Button
                    onClick={() => {
                        resetRoomSettings(roomId);
                        router.push(`/room/${roomId}`);
                    }}
                    value="お題を変える"
                    className="w-full mt-4"
                />
                <Button
                    onClick={() => {
                        setStatusRoom(roomId, 'FINISHED');
                        router.push(`/lobby`);
                    }}
                    value="終了する"
                    className="w-full mt-4"
                />
            </div>
        </Modal>
    )
}