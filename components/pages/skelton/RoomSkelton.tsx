import Card from '@/components/atoms/Card';
import Button from '@/components/atoms/Button';
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
                                <div className='my-4'>
                                    <p>
                                        <span className='font-bold'>Drawer</span>はお題を描こう
                                    </p>
                                </div>

                                    <Button value="Drawページへ" icon={<TbPencil />} />
                            </Card>

                            {/* 回答者用の説明 */}
                            <Card className="mb-4">
                                <div className='my-4'>
                                    <p>
                                        <span className='font-bold'>Answer</span>はDrawerの描いた絵を見てお題を当てよう
                                    </p>
                                </div>

                                <Button value="Answerページへ" icon={<TbBallBowling />} />
                            </Card>
                    </div>
                </Card>
            </div>
        </div>
    )
}