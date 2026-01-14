import Header from '@/components/organisms/Header';
import Button from '@/components/atoms/Button';
import Link from 'next/link';

export default function NotFound() {
    return (
        <>
            <Header />
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
                <p className="mb-8 text-gray-600">お探しのページは存在しないか、移動しました。</p>
                <Link href="/">
                    <Button href="/" value="ホームに戻る" />
                </Link>
            </div>
        </>
    );
}
