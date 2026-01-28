import Modal from "../Modal";
import Button from "@/components/atoms/Button";
import { useState } from "react";
import Loading from "@/components/atoms/Loading";
import Input from "@/components/atoms/Input";
import { searchRoomSchema } from "@/lib/room";
import { getRoomByShortId } from "@/app/lobby/action";

export default function SearchRoomModal({
    isOpen,
    onClose
}: {
    isOpen: boolean;
    onClose: () => void;
}) {
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [roomId, setRoomId] = useState<string>('');

    /**
     * ルーム検索入力変更時
     * 
     * @param e 
     */
    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const result = searchRoomSchema(e.target.value);
        const upperValue = e.target.value.toUpperCase();

        if (!result) return;
        if (!result.success) {
            setError(result.error);
        } else {
            setError(null);
        }
        setRoomId("");
        setRoomId(upperValue);
    }

    const submitSearch = async () => {
        const result = searchRoomSchema(roomId);
        if (!result) return;
        if (!result.success) {
            setError(result.error);
            return;
        }

        setLoading(true);
        setError(null);
        // 検索処理
        const dbResult = await getRoomByShortId(roomId);
        if (!dbResult) return;
        if (!dbResult.success) {
            setError(dbResult.error || 'ルームの検索に失敗しました。');
        } else {
            // ルームが見つかった場合、ルームページへ遷移
            window.location.href = `/room/${dbResult.data.id}`;
        }
        setLoading(false);
    }

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
        >
            <p className="font-semibold mb-2 text-gray-700">ルームIDの入力</p>
            <p className="font-semibold text-gray-700 text-sm">大文字と数字の6桁でIDを入力してください。</p>
            <p className="font-semibold mb-4 text-gray-400 text-sm">※小文字は自動で大文字に変換されます。</p>

            <div className="h-15">
                <Input
                    value={roomId}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleSearch(e)}
                    className="w-full"
                />
                {error && <p className="text-red-500 font-semibold text-sm mt-2">{error}</p>}
            </div>

            <div className='flex space-x-2 mt-6 justify-end'>
                <Button
                    value='キャンセル'
                    onClick={() => onClose()}
                    disabled={loading}
                />
                <Button
                    value='検索'
                    icon={loading ? <Loading /> : null}
                    onClick={() => {
                        handleSearch({ target: { value: roomId } } as React.ChangeEvent<HTMLInputElement>);
                        submitSearch();
                    }}
                    className='w-30'
                />
            </div>
        </Modal>
    )
}