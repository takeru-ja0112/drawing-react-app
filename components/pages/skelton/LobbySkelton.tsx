import Card from '@/components/atoms/Card';
import Input from '@/components/atoms/Input';
import Link from 'next/link';
import { TbArrowLeft } from 'react-icons/tb';

export default function Loading() {
    return (
        <div className="p-8">
            <div className="max-w-lg mx-auto">
                <Link href={`/`} className='z-50 fixed top-13 left-2 text-gray-500 hover:text-gray-700 transition duration-300 p-2 rounded-full'>
                    <TbArrowLeft size='2em' />
                </Link>
                <Card className='mb-4 h-[164px] animate-pulse'>
                    <div className='mb-2'>
                        <label htmlFor="username" className='font-semibold text-gray-700'>ユーザー名</label>
                    </div>
                    <div className='my-2'>
                        <Input
                            name="skelton"
                            className={`w-full `}
                        />
                    </div>
                </Card>

                <Card className='mb-4 h-[400px] animate-pulse'>
                    <div className='mb-2'>
                        <h2 className='font-semibold text-gray-700'>ルーム</h2>
                    </div>
                    <div className='grid gap-3 sm:grid-cols-2 mb-4'>
                        <div className='h-12 bg-gray-300 rounded-full animate-pulse'
                        />
                        <div className='h-12 bg-gray-300 rounded-full animate-pulse'
                        />
                    </div>
                    <div className='mb-2'>
                        <h2 className='font-semibold text-gray-700'>最後に入ったルーム</h2>
                    </div>
                    <div className='h-32 bg-gray-300 rounded-lg animate-pulse'>
                    </div>
                </Card>
            </div>
        </div>
    );
}