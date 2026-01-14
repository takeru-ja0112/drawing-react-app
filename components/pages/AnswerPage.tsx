"use client";

import { Stage, Layer, Line, Circle } from 'react-konva';
import { useState , useEffect} from 'react';
import Header from '@/components/organisms/Header';
import { setdbAnswer } from '@/app/room/[id]/answer/action';
import Button from '@/components/atoms/Button';

type Drawing = {
    id: string;
    room_id: string;
    user_id: string;
    user_name: string;
    canvas_data: {
        lines: number[][];
        circles: Array<{ x: number; y: number; radius: number }>;
    };
    element_count: number;
    created_at: string;
};

type AnswerPageProps = {
    roomId: string;
    drawings: Drawing[];
};

export default function AnswerPage({ roomId, drawings }: AnswerPageProps) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [answer, setAnswer] = useState('');

    const currentDrawing = drawings[currentIndex];

    const handleNext = () => {
        if (currentIndex < drawings.length - 1) {
            setCurrentIndex(currentIndex + 1);
        }
    };

    const handlePrev = () => {
        if (currentIndex > 0) {
            setCurrentIndex(currentIndex - 1);
        }
    };

    useEffect(() => {
        const userId = localStorage.getItem('drawing_app_user_id');
        if (!userId) return;
        // 回答者として登録
        const registerAnswerer = async () => {
            const result = await setdbAnswer(roomId, userId); // 'current-user-id'は実際のユーザーIDに置き換えてください
            if (!result.success) {
                console.error('Failed to set answerer:', result.error);
            }
        };
        registerAnswerer();
    }, []);

    return (
        <>
            <Header />
            <div className="flex flex-col items-center justify-center min-h-screen bg-gray-200 p-8">
                <div className="max-w-4xl w-full bg-white rounded-2xl shadow-xl p-8">
                    <h1 className="text-4xl font-bold mb-4 text-center">
                        回答フェーズ
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
                                        </Layer>
                                    </Stage>
                                </div>
                            </div>

                            {/* 回答入力 */}
                            <div className="mb-6">
                                <input
                                    type="text"
                                    value={answer}
                                    onChange={(e) => setAnswer(e.target.value)}
                                    placeholder="答えを入力してください"
                                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none text-lg"
                                />
                            </div>

                            {/* ナビゲーションボタン */}
                            <div className="flex justify-between gap-4">
                                <button
                                    onClick={handlePrev}
                                    disabled={currentIndex === 0}
                                    className="px-6 py-3 bg-gray-300 text-gray-700 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-400 transition"
                                >
                                    ← 前へ
                                </button>

                                <Button
                                    value="✓ 回答する"
                                />

                                <button
                                    onClick={handleNext}
                                    disabled={currentIndex === drawings.length - 1}
                                    className="px-6 py-3 bg-gray-300 text-gray-700 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-400 transition"
                                >
                                    次へ →
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </>
    );
}