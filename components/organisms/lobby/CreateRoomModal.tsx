import Modal from "@/components/organisms/Modal";
import Input from "@/components/atoms/Input";
import Button from "@/components/atoms/Button";
import Loading from "@/components/atoms/Loading";
import RoomSetting from "@/components/organisms/RoomSetting";
import type { CreateRoom } from '@/type/roomType';


export default function CreateRoomModal({
    isOpen,
    roomName,
    roomError,
    loading,
    createRoomData,
    setIsOpen,
    setRoomName,
    setCreateRoomData,
    createRoom,
    className,
}: {
    isOpen: boolean,
    roomName: string,
    roomError: string,
    loading: boolean,
    createRoomData: CreateRoom,
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>,
    setRoomName: React.Dispatch<React.SetStateAction<string>>,
    setCreateRoomData: React.Dispatch<React.SetStateAction<CreateRoom>>,
    createRoom: () => void,
    className?: string,
}) {
    return (
        <>
            <Modal
                isOpen={isOpen}
                onClose={() => setIsOpen(false)}
                className={className}
            >
                <p className="font-semibold mb-2 text-gray-700">ルーム名の入力</p>
                <Input
                    value={createRoomData.roomName}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCreateRoomData(prev => ({ ...prev, roomName: e.target.value }))}
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
                    setCreateRoomData={setCreateRoomData}
                />
                <div className='flex space-x-2 mt-4 justify-end'>
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