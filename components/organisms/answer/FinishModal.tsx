import Modal from '@/components/organisms/Modal'
import Button from '@/components/atoms/Button';

export default function FinishModal({ onFinish, onReset }: { onFinish: () => void; onReset: () => void;  }) {
    return (
        <Modal isOpen={true}>
            <div className="p-6">
                <h2 className="text-2xl font-bold mb-4 text-center">お題を変更してルームに戻りますか？</h2>
                <Button
                    onClick={onReset}
                    value="お題を変える"
                    className="w-full mt-4"
                />
                <Button
                    onClick={onFinish}
                    value="終了してロビーに戻る"
                    className="w-full mt-4"
                />
            </div>
        </Modal>
    )
}