import Modal from '@/components/organisms/Modal';

export default function CorrectModal({onClick }: { onClick: () => void }) {
    return (
        <Modal isOpen={true} onClose={onClick}>
            <div className="p-6">
                <h2 className="text-2xl font-bold mb-4 text-center">正解です！</h2>
                <p className="text-center">おめでとうございます！正解です！</p>
            </div>
        </Modal>
    )
}