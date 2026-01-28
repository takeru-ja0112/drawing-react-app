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

                <Card className='mb-4 h-[500px] animate-pulse'>
                    <div className='mb-2'>
                        <label htmlFor="username" className='font-semibold text-gray-700'>ルーム検索</label>
                    </div>
                    <div className='mb-5'>
                        <Input
                            name="skelton"
                            className={`w-full `}
                        />
                    </div>
                    <div className='mb-2'>
                        <label htmlFor="username" className='font-semibold text-gray-700'>参加可能なルーム</label>
                    </div>
                </Card>
            </div>
        </div>
    );
}