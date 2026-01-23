import Card from '@/components/atoms/Card';

export default function Loading() {
    return (
        <div className="flex flex-col items-center justify-center p-8 animate-pulse">
            <Card className="max-w-lg w-full">
                    <div className="text-center py-12">
                        <p className="text-xl text-gray-500">まだ描画データがありません</p>
                    </div>
            </Card>
        </div>
    )
}