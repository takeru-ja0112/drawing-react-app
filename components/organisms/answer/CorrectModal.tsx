import Modal from '@/components/organisms/Modal';

export default function CorrectModal() {
    return (
        <Modal isOpen={true} onClose={() => {}}>
            <div className="p-6 bg-white rounded-2xl shadow-lg">
                <h2 className="text-2xl font-bold mb-4 text-center">正解です！</h2>
                <p className="text-center">おめでとうございます！正しい答えを見つけました。</p>
            </div>
        </Modal>
    )
}