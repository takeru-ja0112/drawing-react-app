"use client";

import { setStatusRoom } from '@/app/room/[id]/action';
import { checkAnswerRole } from '@/app/room/[id]/answer/action';
import Button from '@/components/atoms/Button';
import Card from '@/components/atoms/Card';
import Input from '@/components/atoms/Input';
import useStatus from '@/hooks/useStatus';
import { supabase } from '@/lib/supabase';
import confetti from 'canvas-confetti';
import { motion } from 'motion/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { IconContext } from 'react-icons';
import { TbArrowBadgeLeftFilled, TbArrowBadgeRightFilled, TbArrowLeft, TbLock } from 'react-icons/tb';
import { Circle, Layer, Line, Rect, Stage } from 'react-konva';
import ChallengeModal from '../organisms/answer/ChallengeModal';
import CorrectModal from '../organisms/answer/CorrectModal';
import FinishModal from '../organisms/answer/FinishModal';
import MistakeModal from '../organisms/answer/MistakeModal';
import BgObject from '../organisms/BgObject';
import StatusBar from '../organisms/StatusBat';
import { useModalContext } from '@/hooks/useModalContext';
import AnswerCloseModal from '@/components/organisms/answer/AnswerCloseModal';
import PleaseCloseModal from '@/components/organisms/answer/PleaseCloseModal';
import FinalAnswerModal from '@/components/organisms/answer/FinalAnswerModal';

type Drawing = {
    id: string;
    room_id: string;
    user_id: string;
    user_name: string;
    canvas_data: {
        lines: number[][];
        circles: Array<{ x: number; y: number; radius: number }>;
        rects: Array<{ x: number; y: number; width: number; height: number; rotation: number }>;
    };
    element_count: number;
    created_at: string;
};

type AnswerPageProps = {
    roomId: string;
    drawings: Drawing[];
    theme: ThemePattern | null;
    status: 'WATING' | 'DRAWING' | 'ANSWERING' | 'FINISHED' | 'RESETTING';
};

interface ThemePattern {
    furigana: string;
    kanji: string;
    katakana: string;
}

export default function AnswerPage({ roomId, drawings, theme }: AnswerPageProps) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [answer, setAnswer] = useState('');
    const [isAnswerRole, setIsAnswerRole] = useState(false);
    const [data, setData] = useState<Drawing[]>(drawings);

    const currentDrawing = data[currentIndex];
    const { furigana, kanji, katakana }: ThemePattern = theme ? theme : { furigana: '', kanji: '', katakana: '' };

    const [isOpen, setIsOpen] = useState(false);
    const [mistake, setMistake] = useState<number>(0);
    const { open, close, modalType } = useModalContext();

    const router = useRouter();

    const handleNext = () => {
        if (currentIndex < data.length - 1) {
            setCurrentIndex(currentIndex + 1);
        }
    };

    const handleBack = () => {
        if (currentIndex > 0) {
            setCurrentIndex(currentIndex - 1);
        }
    }

    const handleAnswer = () => {
        if (!isAnswerRole || !theme) return;

        if (roomStatus.status !== 'ANSWERING') { open('pleaseClose'); return; };

        
        const result = isAnswerMatched(answer);
        if (result) {
            // 正解時の処理
            open('correct');
            setIsOpen(false);
            fire();
            
        } else {
            // 不正解時の処理
            if (mistake + 1 >= data.length) {
                open('challenge');
            } else {
                setMistake(currentIndex + 1);
                open('mistake');
            }
            setIsOpen(false);
        }
    }

    const isAnswerMatched = (userAnswer: string) => {
        if (userAnswer === null) return false;

        const formFurigana = furigana.split('・').join('');
        const formKanji = kanji.split('・').join('');
        const formKatakana = katakana.split('・').join('');

        if (userAnswer === formFurigana) return true;
        if (userAnswer === formKanji) return true;
        if (userAnswer === formKatakana) return true;

        return false;
    };

    const fire = () => {
        confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 },
        });
    };

    const handleModify = async () => {
        await setStatusRoom(roomId, 'DRAWING');
        setMistake(0);
        setCurrentIndex(0);
        close();
    }

    const handleFinish = async () => {
        await setStatusRoom(roomId, 'FINISHED');
        router.push(`/lobby`);
    }

    useEffect(() => {
        const userId = localStorage.getItem('drawing_app_user_id');
        if (!userId) return;
        const fetchAnswerRole = async () => {
            const result = await checkAnswerRole(roomId, userId);
            if (result.success) {
                setIsAnswerRole(result.isAnswerRole);
            } else {
                console.error('Failed to check answer role:', result.error);
            }
        };
        fetchAnswerRole();
    }, [roomId]);

    useEffect(() => {
        // 初回データ取得
        const fetchData = async () => {
            const { data } = await supabase
                .from('drawings')
                .select('*')
                .eq('room_id', roomId)
                .order('element_count', { ascending: true });
            setData(data || []);
        };
        fetchData();

        const subscription = supabase
            .channel('public:drawings')
            .on(
                'postgres_changes',
                { event: 'INSERT', schema: 'public', table: 'drawings', filter: `room_id=eq.${roomId}` },
                () => {
                    setCurrentIndex(0);
                    setAnswer('');
                    fetchData();
                }
            )
            .on(
                'postgres_changes',
                { event: 'UPDATE', schema: 'public', table: 'drawings', filter: `room_id=eq.${roomId}` },
                () => {
                    setCurrentIndex(0);
                    setAnswer('');
                    fetchData();
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(subscription
            )
        };
    }, [roomId]);

    const { roomStatus } = useStatus(roomId);

    return (
        <>
            <BgObject />
            <div className="flex flex-col items-center justify-center p-8">
                <Link href={`/room/${roomId}`} className='absolute top-13 left-2 hover:text-yellow-600 transition duration-300 p-2 rounded-full'>
                    <TbArrowLeft size='2em' />
                </Link>
                {
                    roomStatus.status !== 'ANSWERING' &&
                    isAnswerRole &&
                    (
                        <IconContext.Provider value={{ size: '1.5em' }}>
                            <Button
                                value='締め切る'
                                icon={<TbLock />}
                                onClick={() => open('answerClose')}
                                className='mb-4'
                            />
                        </IconContext.Provider>
                    )}
                {/* ステータスエリア */}
                <StatusBar status={roomStatus.status}></StatusBar>
                <Card className="max-w-lg w-full">

                    {data.length === 0 ? (
                        <div className="text-center py-12">
                            <p className="text-xl text-gray-500">まだ描画データがありません</p>
                        </div>
                    ) : (
                        <>
                            {/* 進捗表示 */}
                            <div className="mb-6 text-center">
                                <p className="text-lg font-semibold">
                                    {currentIndex + 1} / {data.length} 人目
                                </p>
                                <p className="text-sm text-gray-500">
                                    要素数: {currentDrawing?.element_count}
                                </p>
                                <p className="text-sm text-gray-500 whitespace-nowrap overflow-hidden text-ellipsis">
                                    描いた人: {currentDrawing?.user_name}
                                </p>
                            </div>

                            {/* キャンバス表示 */}
                            <div className="flex justify-center mb-6">
                                {!currentDrawing ? (
                                    <div className="border-4 border-gray-300 rounded-lg overflow-hidden shadow-lg w-[300px] h-[300px] flex items-center justify-center bg-gray-100 animate-pulse">
                                        <div className="w-2/3 h-2/3 bg-gray-300 rounded-lg" />
                                        <p>読み込み中...</p>
                                    </div>
                                ) : (
                                    <div className='flex items-center gap-1'>
                                        <IconContext.Provider value={{ size: '2em', color: '#808080' }}>
                                            <motion.button
                                                initial={{ scale: 1 }}
                                                whileTap={{ scale: 0.9 }}
                                                onClick={handleBack}
                                                disabled={currentIndex === 0}
                                                className='disabled:opacity-30 disabled:cursor-not-allowed'
                                            >
                                                <TbArrowBadgeLeftFilled />
                                            </motion.button>
                                            <div className="border-4 border-gray-300 w-[300px] h-[300px] relative rounded-lg overflow-hidden shadow-lg">
                                                {/* レースカーテンのような表現 */}
                                                <button
                                                    onClick={() => { 
                                                        if(roomStatus.status !== 'ANSWERING')open('pleaseClose');
                                                        else setIsOpen(!isOpen); 
                                                    }}
                                                    className="absolute top-0 left-0 w-full h-full z-20 cursor-pointer"
                                                >
                                                    <div className='w-full h-full flex absolute top-0 z-10'>
                                                        <motion.div
                                                            initial={{ left: 0 }}
                                                            animate={isOpen ? { left: '-100%' } : { left: '0' }}
                                                            transition={isOpen ? { duration: 3, ease: "easeInOut" } : undefined}
                                                            className="absolute w-1/2 h-full bg-yellow-500 rounded-br-[30%]"
                                                        />
                                                        <motion.div
                                                            initial={{ right: 0 }}
                                                            animate={isOpen ? { right: '-100%' } : { right: '0' }}
                                                            transition={isOpen ? { duration: 3, ease: "easeInOut" } : undefined}
                                                            className="absolute w-1/2 h-full bg-yellow-500 rounded-bl-[30%]"
                                                        />
                                                    </div>
                                                    <div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2  z-11'>
                                                        <motion.h1
                                                            initial={{ opacity: 1 }}
                                                            animate={isOpen ? { opacity: 0 } : { opacity: 1 }}
                                                            transition={isOpen ? { duration: 1 } : undefined}
                                                            className='font-bold text-4xl text-white'
                                                        >ひらく</motion.h1>
                                                    </div>
                                                </button>
                                                <Stage width={300} height={300}>
                                                    <Layer>
                                                        {currentDrawing.canvas_data.lines.map((line, i) => (
                                                            <Line key={`line-${i}`} points={line} stroke="black" strokeWidth={3} />
                                                        ))}
                                                        {currentDrawing.canvas_data.circles.map((circle, i) => (
                                                            <Circle
                                                                key={`circle-${i}`}
                                                                x={circle.x}
                                                                y={circle.y}
                                                                radius={circle.radius}
                                                                stroke="black"
                                                                strokeWidth={3}
                                                            />
                                                        ))}
                                                        {currentDrawing.canvas_data.rects.map((rect, i) => (
                                                            <Rect
                                                                key={`rect-${i}`}
                                                                x={rect.x}
                                                                y={rect.y}
                                                                width={rect.width}
                                                                height={rect.height}
                                                                stroke="black"
                                                                strokeWidth={3}
                                                            />
                                                        ))}
                                                    </Layer>
                                                </Stage>
                                            </div>
                                            <button
                                                onClick={() => {
                                                    if (isAnswerRole && currentIndex >= mistake) return;
                                                    handleNext()
                                                }}
                                                className='disabled:opacity-50 disabled:cursor-not-allowed'
                                                disabled={isAnswerRole ? currentIndex >= mistake : currentIndex === data.length - 1}
                                            >
                                                <TbArrowBadgeRightFilled />
                                            </button>
                                        </IconContext.Provider>
                                    </div>
                                )}
                            </div>

                            {/* 回答入力 */}
                            {isAnswerRole && (
                                <div className="mb-6">
                                    <Input
                                        type="text"
                                        value={answer}
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAnswer(e.target.value)}
                                        placeholder="答えを入力してください"
                                        className="w-full "
                                        disabled={!roomStatus || roomStatus.status !== 'ANSWERING'}
                                    />
                                    <p className='text-gray-400 text-sm'>ひらがな、カタカナ、漢字のいずれでも構いません。</p>
                                </div>
                            )}

                            {/* ナビゲーションボタン */}
                            <div className="flex justify-between gap-4">
                                {isAnswerRole && (
                                    <>
                                        <Button
                                            value="回答する"
                                            onClick={() => open('finalAnswer')}
                                            disabled={!isAnswerRole}
                                            className='w-80 mx-auto'
                                        />
                                    </>
                                )}

                            </div>
                        </>
                    )}
                </Card>
                {modalType === 'finalAnswer' && <FinalAnswerModal handleAnswer={handleAnswer} />}
                {modalType === 'answerClose' && isAnswerRole && <AnswerCloseModal roomId={roomId} dataLength={data.length} />}
                {modalType === 'correct' && <CorrectModal roomId={roomId} />}
                {modalType === 'mistake' && <MistakeModal onClick={() => handleNext()}/>}
                {modalType === 'challenge' && <ChallengeModal
                    roomId={roomId}
                    onModify={handleModify}
                    onFinish={handleFinish}
                />}
                {modalType === 'pleaseClose' && <PleaseCloseModal />}
                {roomStatus.status === "FINISHED" && isAnswerRole &&
                    <FinishModal roomId={roomId}></FinishModal>
                }
            </div>
        </>
    );
}