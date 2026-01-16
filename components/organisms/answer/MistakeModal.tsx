import Modal from '@/components/organisms/Modal';

export default function MistakeModal({ onClick}: { onClick: () => void }) {
    return (
        <Modal isOpen={true} onClose={onClick}>
            <div className="p-6">
                <h2 className="text-2xl font-bold mb-4 text-center">ちゃいます！</h2>
                <p className="text-center">次のイラストへ移ります</p>
            </div>
        </Modal>
    )
}