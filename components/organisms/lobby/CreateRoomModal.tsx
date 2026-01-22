import Modal from "@/components/organisms/Modal";
import Input from "@/components/atoms/Input";
import Button from "@/components/atoms/Button";
import Loading from "@/components/atoms/Loading";
import RoomSetting from "@/components/organisms/RoomSetting";
import type { CreateRoom, RoomSettingType  } from '@/type/roomType';
import { useState } from "react";


export default function CreateRoomModal({
    isOpen,
    roomError,
    loading,
    createRoomData,
    setIsOpen,
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
    const [ settingData , setSettingData ] = useState<RoomSettingType>({
        level: 'normal',
        genre: 'ランダム',
    });

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
                <RoomSetting<RoomSettingType>
                    className="mt-6"
                    setRoomData={setSettingData}
                />
                <div className='flex space-x-2 mt-6 justify-end'>
                    <Button
                        value='キャンセル'
                        onClick={() => setIsOpen(false)}
                        disabled={loading}
                    />
                    <Button
                        value='作成'
                        icon={loading ? <Loading /> : null}
                        onClick={()=>{
                            setCreateRoomData(prev => ({
                                ...prev,
                                level: settingData.level,
                                genre: settingData.genre,
                            }))
                            createRoom();
                        }}
                        disabled={loading}
                        className='w-30'
                    />
                </div>
            </Modal>
        </>
    )
}