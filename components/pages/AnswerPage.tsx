"use client";

import { Stage, Layer, Line, Circle, Rect } from 'react-konva';
import { useState, useEffect, useRef } from 'react';
import Header from '@/components/organisms/Header';
import { setdbAnswer, checkAnswerRole } from '@/app/room/[id]/answer/action';
import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
import ReactCanvasConfetti from 'react-canvas-confetti';
import confetti from 'canvas-confetti';

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

    const currentDrawing = drawings[currentIndex];
    const { furigana, kanji, katakana }: ThemePattern = theme ? theme : { furigana: '', kanji: '', katakana: '' };

    const handleNext = () => {
        setIsNext(false);

        if (currentIndex < drawings.length - 1) {
            setCurrentIndex(currentIndex + 1);
        }
    };

    const handleAnswer = async () => {
        if (!isAnswerRole || !theme) return;

        const result = isAnswerMatched(answer);
        if (result) {
            alert('正解です！');
            fire();
        } else {
            // 不正解時の処理
            setIsNext(true);
            console.log(isNext);
            alert('ちゃいます！')
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
        // 回答者として登録
        const registerAnswerer = async () => {
            const result = await setdbAnswer(roomId, userId); // 'current-user-id'は実際のユーザーIDに置き換えてください
            if (!result.success) {
                // console.error('Failed to set answerer:', result.error);
            }
        };
        registerAnswerer();
    }, []);

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

    return (
        <>
            <Header />
            <div className="flex flex-col items-center justify-center p-8">
                <div className="max-w-4xl w-full bg-white rounded-2xl shadow-xl p-8">
                    <h1 className="text-4xl font-bold mb-4 text-center">
                        回答
                    </h1>

                    {drawings.length === 0 ? (
                        <div className="text-center py-12">
                            <p className="text-xl text-gray-500">まだ描画データがありません</p>
                        </div>
                    ) : (
                        <>
                            {/* 進捗表示 */}
                            <div className="mb-6 text-center">
                                <p className="text-lg font-semibold">
                                    {currentIndex + 1} / {drawings.length} 人目
                                </p>
                                <p className="text-sm text-gray-500">
                                    要素数: {currentDrawing.element_count} |
                                    描いた人: {currentDrawing.user_name}
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
                                    <div className="border-4 border-gray-300 rounded-lg overflow-hidden shadow-lg">
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
                            {isAnswerRole && (
                                <div className="mb-6">
                                    <Input
                                        type="text"
                                        value={answer}
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAnswer(e.target.value)}
                                        placeholder="答えを入力してください"
                                        className="w-full "
                                    />
                                </div>
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

                                <Button
                                    onClick={handleNext}
                                    disabled={!isNext}
                                    className={
                                        isNext
                                            ?
                                            ''
                                            :
                                            'bg-gray-300 text-gray-500 cursor-not-allowed'
                                    }
                                    value='次へ'
                                />
                            </div>
                        </>
                    )}
                </div>
            </div>
        </>
    );
}