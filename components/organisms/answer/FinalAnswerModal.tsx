import Modal from '@/components/organisms/Modal';
import { useModalContext } from '@/hooks/useModalContext';
import Button from '@/components/atoms/Button';

export default function FinalAnswerModal({ handleAnswer }: { handleAnswer: () => void }) {
    const { modalType, close } = useModalContext();

    return (
        <Modal isOpen={modalType === 'finalAnswer'} onClose={() => {
            close();
        }}>
            <div className="p-4">
                <h2 className="text-2xl font-bold mb-2 text-center">回答しますか？</h2>
                <div className="grid grid-cols-2 gap-4">
                    <Button
                        onClick={() => {
                            close();
                        }}
                        value="いいえ"
                        className="w-full mt-4"
                    />
                    <Button
                        onClick={() => {
                            handleAnswer();
                        }}
                        value="はい"
                        className="w-full mt-4"
                    />
                </div>
            </div>
        </Modal>
    )
}