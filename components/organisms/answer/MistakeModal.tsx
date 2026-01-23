import Modal from '@/components/organisms/Modal';
import { useModalContext } from '@/hooks/useModalContext';
import Button from '@/components/atoms/Button';
import { setdbAnswerResult } from '@/app/room/[id]/answer/action';

export default function MistakeModal({ roomId, onClick }: { roomId: string; onClick: () => void }) {
    const { close } = useModalContext();
    
    return (
        <Modal isOpen={true} onClose={()=> { onClick(); close(); }}>
            <div className="p-6">
                <h2 className="text-2xl font-bold mb-4 text-center">ちゃいます！</h2>
                <p className="text-center">次のイラストへ移ります</p>
                <Button
                    onClick={() => {
                        setdbAnswerResult(roomId, '');
                        onClick();
                        close();
                    }}
                    value="OK"
                    className="w-full mt-4"
                />
            </div>
        </Modal>
    );
}