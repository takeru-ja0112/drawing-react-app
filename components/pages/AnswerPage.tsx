"use client";

import { Stage, Layer, Line, Circle, Rect } from 'react-konva';
import { useState, useEffect, useRef } from 'react';
import Header from '@/components/organisms/Header';
import { setdbAnswer, checkAnswerRole } from '@/app/room/[id]/answer/action';
import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
import ReactCanvasConfetti from 'react-canvas-confetti';
import confetti from 'canvas-confetti';
import Card from '@/components/atoms/Card';
import MistakeModal from '../organisms/answer/MistakeModal';
import CorrectModal from '../organisms/answer/CorrectModal';
import { motion } from 'motion/react';
import { supabase } from '@/lib/supabase';

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
    const confettiRef = useRef<any>(null);
    const [isNext, setIsNext] = useState(false);
    const [data, setData] = useState<Drawing[]>(drawings);

    const currentDrawing = data[currentIndex];
    const { furigana, kanji, katakana }: ThemePattern = theme ? theme : { furigana: '', kanji: '', katakana: '' };

    const [isOpen, setIsOpen] = useState(false);
    const [correctModal, setCorrectModal] = useState(false);
    const [mistakeModal, setMistakeModal] = useState(false);


    const handleNext = () => {
        console.log("Next clicked");
        if (currentIndex < data.length - 1) {
            setCurrentIndex(currentIndex + 1);
        }
        setMistakeModal(false);
    };

    const handleAnswer = async () => {
        if (!isAnswerRole || !theme) return;

        const result = isAnswerMatched(answer);
        if (result) {
            setCorrectModal(true);
            fire();
        } else {
            setMistakeModal(true);
            setIsNext(true);
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
    }, []);

    useEffect(() => {
        // 初回データ取得
        const fetchData = async () => {
            const { data } = await supabase.from('drawings').select('*').eq('room_id', roomId).order('created_at', { ascending: false });
            setData(data || []);
        };
        fetchData();
        console.log("Drawings data:", data);

        const subscription = supabase
            .channel('public:drawings')
            .on(
                'postgres_changes',
                { event: 'INSERT', schema: 'public', table: 'drawings', filter: `room_id=eq.${roomId}` },
                () => {
                    setCurrentIndex(0);
                    setAnswer('');
                    setIsNext(false);
                    fetchData();
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(subscription
            )
        };
    }, []);

    return (
        <>
            <div className="flex flex-col items-center justify-center p-8">
                <Card className="max-w-lg w-full">
                    <h1 className="text-4xl font-bold mb-4 text-center">
                        回答
                    </h1>

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
                                    <div className="border-4 border-gray-300 relative rounded-lg overflow-hidden shadow-lg">
                                        {/* レースカーテンのような表現 */}
                                        <button
                                            onClick={() => { setIsOpen(true); console.log("Modal opened") }}
                                        >
                                            <div className='w-full h-full flex absolute top-0 z-10'>
                                                <motion.div
                                                    initial={{ left: 0 }}
                                                    animate={isOpen ? { left: '-100%' } : { left: '0' }}
                                                    transition={{ duration: 3, ease: "easeInOut" }}
                                                    className="absolute w-1/2 h-full bg-yellow-500 rounded-br-[30%]"
                                                />
                                                <motion.div
                                                    initial={{ right: 0 }}
                                                    animate={isOpen ? { right: '-100%' } : { right: '0' }}
                                                    transition={{ duration: 3, ease: "easeInOut" }}
                                                    className="absolute w-1/2 h-full bg-yellow-500 rounded-bl-[30%]"
                                                />
                                            </div>
                                            <div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2  z-11'>
                                                <motion.h1
                                                    initial={{ opacity: 1 }}
                                                    animate={isOpen ? { opacity: 0 } : { opacity: 1 }}
                                                    transition={{ duration: 1, }}
                                                    className='font-bold text-4xl text-white'
                                                >ひらく</motion.h1>
                                            </div>
                                        </button>

                                        <Stage width={300} height={300}>
                                            <Layer>
                                                {currentDrawing.canvas_data.lines.map((line, i) => (
                                                    <Line key={`line-${i}`} points={line} stroke="black" strokeWidth={2} />
                                                ))}
                                                {currentDrawing.canvas_data.circles.map((circle, i) => (
                                                    <Circle
                                                        key={`circle-${i}`}
                                                        x={circle.x}
                                                        y={circle.y}
                                                        radius={circle.radius}
                                                        stroke="black"
                                                        strokeWidth={2}
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
                                                        strokeWidth={2}
                                                    />
                                                ))}
                                            </Layer>
                                        </Stage>
                                    </div>
                                )}
                            </div>

                            {/* 回答入力 */}
                            {isAnswerRole ? (
                                <div className="mb-6">
                                    <Input
                                        type="text"
                                        value={answer}
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAnswer(e.target.value)}
                                        placeholder="答えを入力してください"
                                        className="w-full "
                                    />
                                </div>
                            ) : (
                                <Button
                                    onClick={handleNext}
                                    className={
                                        isNext ? '' : 'w-full'
                                    }
                                    value='次へ'
                                />
                            )}

                            {/* ナビゲーションボタン */}
                            <div className="flex justify-between gap-4">
                                {isAnswerRole && (
                                    <Button
                                        value="回答する"
                                        onClick={handleAnswer}
                                        disabled={!isAnswerRole}
                                    />
                                )}

                            </div>
                        </>
                    )}
                </Card>

                {correctModal &&
                    <CorrectModal
                        onClick={() => setCorrectModal(false)}
                    />
                }
                {mistakeModal &&
                    <MistakeModal
                        onClick={() => handleNext()}
                    />
                }
                {/* <MistakeModal /> */}
            </div>
        </>
    );
}