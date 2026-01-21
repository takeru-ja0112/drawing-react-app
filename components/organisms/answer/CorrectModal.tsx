import { setStatusRoom } from '@/app/room/[id]/action';
import Modal from '@/components/organisms/Modal';
import { useModalContext } from '@/hooks/useModalContext';

export default function CorrectModal({roomId}: {roomId: string}) {
    const { modalType, close } = useModalContext();

    return (
        <Modal isOpen={modalType === 'correct'} onClose={() => {
            setStatusRoom(roomId, 'FINISHED');
            close()
        }}>
            <div className="p-6">
                <h2 className="text-2xl font-bold mb-4 text-center">正解です！</h2>
                <p className="text-center">おめでとうございます！正解です！</p>
            </div>
        </Modal>
    )
}