import Button from '@/components/atoms/Button';
import Card from '@/components/atoms/Card';
import Human from '@/components/atoms/Human';
import { TbBallBowling, TbPencil } from 'react-icons/tb';


export default function Loading() {
    return (
        <div className="w-full p-8">
            <div className="max-w-lg mx-auto">
                <div className="mb-6 text-center">
                    <h2 className="text-lg text-gray-500 font-semibold mb-2">ルーム名</h2>
                    <p className="bg-gray-500 w-20 h-6 mx-auto rounded animate-pulse"></p>
                </div>
                <Card className="mb-4 pb-1 bg-gray-100 rounded-3xl animate-pulse">
                    <Button
                        value='お題を変更する'
                        className='mb-4 w-full'
                    />
                    <div className="text-center">
                                {/* 書く人用の説明 */}
                                <Card className="mb-4">
                                    <div className='my-5 h-20 grid grid-cols-3 gap-0 relative'>
                                        <Human colorClass='bg-yellow-400/50' className='left-1/2'/>
                                        <Human colorClass='bg-yellow-400' className=''/>
                                        <Human colorClass='bg-yellow-400/50' className='-left-1/2'/>
                                    </div>

                                    <div className='flex items-center justify-between gap-2'>
                                        <p className='font-bold text-lg'><span className=''>1</span>人以上</p>
                                            <Button value="お題を描く" icon={<TbPencil />} />
                                    </div>
                                </Card>

                                {/* 回答者用の説明 */}
                                <Card className="mb-4">
                                    <div 
                                        className={`absolute right-3 px-4 py-2 rounded-full font-bold text-sm font-bold
                                        bg-gray-200 text-gray-600`}
                                    >
                                        '未決定'
                                    </div>
                                    <div className='mt-2  h-25 relative'>
                                        <Human 
                                            colorClass={'bg-yellow-400/70'}     
                                            className='top-0'/>
                                    </div>
                                    <div className='flex items-center justify-between gap-2'>
                                        <p className='font-bold text-lg'><span className=''>1</span>人まで </p>
                                        <Button value="回答ページへ" icon={<TbBallBowling />} />
                                    </div>
                                </Card>
                    </div>
                </Card>
            </div>
        </div>
    )
}