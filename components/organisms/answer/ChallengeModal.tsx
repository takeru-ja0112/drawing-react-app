import Modal from '@/components/organisms/Modal';
import Button from '@/components/atoms/Button';
import { resetRoomSettings } from '@/app/room/[id]/action';
import { useRouter } from 'next/navigation';
import { useModalContext } from '@/hooks/useModalContext';

export default function ChallengeModal({ roomId, onModify , onFinish }: { roomId: string; onModify: () => void; onFinish: () => void; }) {
    const router = useRouter();
    const { close } = useModalContext();
    
    return (
        <Modal isOpen={true}>
            <div className="p-6">
                <h2 className="text-2xl font-bold mb-4 text-center">ちゃいます！</h2>
                <h2 className="text-2xl font-bold mb-4 text-center">新しいお題に挑戦しますか？</h2>
                <Button
                    onClick={() => {
                        resetRoomSettings(roomId);
                        close();
                        router.push(`/room/${roomId}`);
                    }}
                    value="挑戦する"
                    className="w-full mt-4"
                />
                <Button
                    onClick={() => {
                        onModify();
                        close();
                    }}
                    value="修正してもらう"
                    className="w-full mt-4"
                />
                <Button
                    onClick={() => {
                        onFinish()
                        close();
                    }}
                    value="終了する"
                    className="w-full mt-4"
                />
            </div>
        </Modal>
    )
}