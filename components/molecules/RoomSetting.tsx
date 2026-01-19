import Select from "@/components/atoms/Select";

/**
 * ルームの詳細設定を行うコンポーネント
 * Modalコンポーネントに包まれていることを前提にしている
 * 
 * @returns JSX.Element
 * 
 */

export default function RoomSetting({ className }: { className?: string }) {
    return (
        <div className={className}>
            <p className="font-semibold mb-2 text-gray-700">ルーム設定</p>
            <Select />
        </div>
    );
}