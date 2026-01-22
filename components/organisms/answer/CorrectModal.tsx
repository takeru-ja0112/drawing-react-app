import Modal from '@/components/organisms/Modal';
import { useModalContext } from '@/hooks/useModalContext';

export default function CorrectModal() {
    const {open , modalType } = useModalContext();

    return (
        <Modal isOpen={modalType === 'correct'} onClose={() => {
            open('finish');
        }}>
            <div className="p-6">
                <h2 className="text-2xl font-bold mb-4 text-center">正解です！</h2>
                <p className="text-center">おめでとうございます！正解です！</p>
            </div>
        </Modal>
    )
}