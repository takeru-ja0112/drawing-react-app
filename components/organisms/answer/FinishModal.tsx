import Modal from '@/components/organisms/Modal'
import Button from '@/components/atoms/Button';
import { resetRoomSettings, resetRoomAnswer, setStatusRoom } from '@/app/room/[id]/action';
import { useRouter } from 'next/navigation';
import { useModalContext } from '@/hooks/useModalContext';

export default function FinishModal({ roomId ,setIsAnswerRole }: { roomId: string; setIsAnswerRole: React.Dispatch<React.SetStateAction<boolean>> }) {
    const router = useRouter();
    const { close } = useModalContext();

    return (
        <Modal isOpen={true}>
            <div className="p-6">
                <h2 className="text-2xl font-bold mb-4 text-center">お題を変更してルームに戻りますか？</h2>
                <Button
                    onClick={async () => {
                        await resetRoomSettings(roomId);
                        router.push(`/room/${roomId}`);
                        close();
                    }}
                    value="お題を変える"
                    className="w-full mt-4"
                />
                <Button
                    onClick={async () => {
                        await resetRoomAnswer(roomId);
                        setIsAnswerRole(false);
                        close();
                    }}
                    value="終了する"
                    className="w-full mt-4"
                />
            </div>
        </Modal>
    )
}