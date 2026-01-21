import Modal from '@/components/organisms/Modal';
import Button from '@/components/atoms/Button';
import { useModalContext } from '@/hooks/useModalContext';

export default function PleaseCloseModal() {
    const { modalType, close } = useModalContext();

    return (
        <Modal isOpen={modalType === 'pleaseClose'} onClose={() => close()}>
            <h2 className="text-2xl font-bold mb-4 text-center">まだ締め切っていません</h2>
            <p className="text-center">締め切ってから回答を始めてください</p>
            <div className="flex justify-end mt-6">
                <Button
                    onClick={() => close()}
                    className=""
                    value='閉じる'
                />
            </div>
        </Modal>
    );
}