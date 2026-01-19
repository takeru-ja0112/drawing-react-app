import Modal from "@/components/organisms/Modal";
import Input from "@/components/atoms/Input";
import Button from "@/components/atoms/Button";
import RoomSetting from "@/components/molecules/RoomSetting";
import Loading from "@/components/atoms/Loading";


export default function CreateRoomModal({
    isOpen,
    roomName,
    roomError,
    loading,
    setIsOpen,
    setRoomName,
    createRoom
}: {
    isOpen: boolean,
    roomName: string,
    roomError: string,
    loading: boolean,
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>,
    setRoomName: React.Dispatch<React.SetStateAction<string>>,
    createRoom: () => void
}) {
    return (
        <>
            <Modal
                isOpen={isOpen}
                onClose={() => setIsOpen(false)}
            >
                <p className="font-semibold mb-2 text-gray-700">ルーム名の入力</p>
                <Input
                    value={roomName}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setRoomName(e.target.value)}
                    className={`w-full ${roomError ? 'border-red-500 border-2' : ''}`}
                    placeholder='ルーム名を入力してください'
                />
                {roomError && (
                    <div className="mt-2">
                        <p className="text-red-500 font-semibold text-sm">{roomError}</p>
                    </div>
                )}
                <RoomSetting
                    className="mt-4"
                />
                <div className='flex space-x-2 mt-4'>
                    <Button
                        value='キャンセル'
                        onClick={() => setIsOpen(false)}
                        disabled={loading}
                    />
                    <Button
                        value='作成'
                        icon={loading ? <Loading /> : null}
                        onClick={createRoom}
                        disabled={loading}
                        className='w-30'
                    />
                </div>
            </Modal>
        </>
    )
}