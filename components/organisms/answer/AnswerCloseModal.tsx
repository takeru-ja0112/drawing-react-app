import Modal from '@/components/organisms/Modal';
import Button from '@/components/atoms/Button';
import { useModalContext } from '@/hooks/useModalContext';
import { setStatusRoom } from '@/app/room/[id]/action';

export default function AnswerCloseModal({ roomId, dataLength }: { roomId: string, dataLength: number }) {
    const { modalType, close } = useModalContext();

    const handleStatusAnswering = async () => {
        await setStatusRoom(roomId, 'ANSWERING');
    };

    return (
        <Modal
            isOpen={modalType === 'answerClose'}
            onClose={() => close()}
        >
            <div>
                {dataLength > 0 ? (
                    <>
                        <h2 className="text-2xl font-bold mb-4 text-center">締め切りますか？</h2>
                        <p>描画中の方はいないですか？<br />参加人数分のイラストが届いている事を確認してください</p>
                        <div className="flex justify-end gap-4 mt-6">
                            <button
                                onClick={() => close()}
                                className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg"
                            >
                                キャンセル
                            </button>
                            <Button
                                onClick={async () => {
                                    await handleStatusAnswering();
                                    close();
                                }}
                                value="OK"
                            />
                        </div>
                    </>
                ) : (
                    <div>
                        <h2 className="text-2xl font-bold mb-4 text-center">イラストが届いていません</h2>
                        <p className="text-center">参加者全員からイラストが届いている事を確認してください</p>
                        <div className="flex justify-end mt-6">
                            <button
                                onClick={() => close()}
                                className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg"
                            >
                                キャンセル
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </Modal>
    )
}