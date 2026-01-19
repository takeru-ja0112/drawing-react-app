"use client";

import { Stage, Layer, Line, Circle, Rect } from 'react-konva';
import { useState, useEffect } from 'react';
import { checkAnswerRole } from '@/app/room/[id]/answer/action';
import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
import confetti from 'canvas-confetti';
import Card from '@/components/atoms/Card';
import MistakeModal from '../organisms/answer/MistakeModal';
import CorrectModal from '../organisms/answer/CorrectModal';
import Modal from '../organisms/Modal';
import { motion } from 'motion/react';
import { supabase } from '@/lib/supabase';
import { setStatusRoom, resetRoomSettings } from '@/app/room/[id]/action';
import FinishModal from '../organisms/answer/FinishModal';
import { useRouter } from 'next/navigation';
import StatusBar from '../organisms/StatusBat';
import ChallengeModal from '../organisms/answer/ChallengeModal';
import { TbArrowBadgeLeftFilled, TbArrowBadgeRightFilled, TbLock } from 'react-icons/tb';
import { IconContext } from 'react-icons';
import useStatus from '@/hooks/useStatus';


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
    const [correctModal, setCorrectModal] = useState(false);
    const [mistakeModal, setMistakeModal] = useState(false);
    const [lastModal, setLastModal] = useState(false);
    const [isStatusAnswering, setIsStatusAnswering] = useState(false);
    const [isPleaseCloseModal, setIsPleaseCloseModal] = useState(false);
    const [isMistakeNextDisabled, setIsMistakeNextDisabled] = useState(false);
    const router = useRouter();

    const handleNext = () => {
        if (currentIndex < data.length - 1) {
            setCurrentIndex(currentIndex + 1);
        }
        setMistakeModal(false);
        setIsMistakeNextDisabled(false);
    };

    const handleBack = () => {
        if (currentIndex > 0) {
            setCurrentIndex(currentIndex - 1);
        }
    }

    const handleAnswer = async () => {
        if (!isAnswerRole || !theme) return;

        if (roomStatus.status !== 'ANSWERING') { setIsPleaseCloseModal(true); return; };

        const result = isAnswerMatched(answer);
        if (result) {
            // 正解時の処理
            setCorrectModal(true);
            fire();

        } else {
            // 不正解時の処理
            if (currentIndex === data.length - 1) {
                setLastModal(true);
            } else {
                setMistakeModal(true);
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

    const handleReset = async () => {
        const result = await resetRoomSettings(roomId);
        if (result.success) {
            router.push(`/room/${roomId}`);
        } else {
            console.error("Failed to reset room:", result.error);
        }
    }

    const handleModify = async () => {
        await setStatusRoom(roomId, 'DRAWING');
        setLastModal(false);
    }

    const handleFinish = async () => {
        await setStatusRoom(roomId, 'FINISHED');
        router.push(`/lobby`);
    }

    const handleStatusAnswering = async () => {
        await setStatusRoom(roomId, 'ANSWERING');
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

    // mistakeModalが開いたら3秒間ボタンを無効化
    useEffect(() => {
        if (mistakeModal) {
            setIsMistakeNextDisabled(true);
            const timer = setTimeout(() => {
                setIsMistakeNextDisabled(false);
            }, 3000);
            return () => clearTimeout(timer);
        } else {
            setIsMistakeNextDisabled(false);
        }
    }, [mistakeModal]);


    const { roomStatus } = useStatus(roomId);

    return (
        <>
            <div className="flex flex-col items-center justify-center p-8">
                {
                    roomStatus.status !== 'ANSWERING' &&
                    isAnswerRole &&
                    (
                        <IconContext.Provider value={{ size: '1.5em' }}>
                            <Button
                                value='締め切る'
                                icon={<TbLock />}
                                onClick={() => setIsStatusAnswering(true)}
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
                                            <div className="border-4 border-gray-300 relative rounded-lg overflow-hidden shadow-lg">
                                                {/* レースカーテンのような表現 */}
                                                <button
                                                    onClick={() => {
                                                        if (roomStatus.status !== 'ANSWERING') { setIsPleaseCloseModal(true); return; };
                                                        setIsOpen(true)

                                                    }}
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
                                            <button
                                                onClick={handleNext}
                                                className='disabled:opacity-50 disabled:cursor-not-allowed'
                                                disabled={currentIndex === data.length - 1}
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
                                            onClick={handleAnswer}
                                            disabled={!isAnswerRole}
                                            className='w-80 mx-auto'
                                        />
                                    </>
                                )}

                            </div>
                        </>
                    )}
                </Card>
                {isStatusAnswering && isAnswerRole &&
                    <Modal
                        isOpen={isStatusAnswering}
                        onClose={() => setIsStatusAnswering(false)}
                    >
                        <div className="p-6">
                            <h2 className="text-2xl font-bold mb-4 text-center">締め切りますか？</h2>
                            <p>描画中の方はいないですか？<br />参加人数分のイラストが届いている事を確認してください</p>
                            <div className="flex justify-end gap-4 mt-6">
                                <button
                                    onClick={() => setIsStatusAnswering(false)}
                                    className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg"
                                >
                                    キャンセル
                                </button>
                                <Button
                                    onClick={async () => {
                                        await handleStatusAnswering();
                                        setIsStatusAnswering(false);
                                    }}
                                    value="OK"
                                />
                            </div>
                        </div>
                    </Modal>
                }


                {correctModal &&
                    <CorrectModal
                        onClick={() => {
                            setCorrectModal(false)
                            setStatusRoom(roomId, 'FINISHED');
                        }}
                    />
                }
                {mistakeModal &&
                    <MistakeModal
                        onClick={() => handleNext()}
                        disabled={isMistakeNextDisabled}
                    />
                }
                {lastModal && <ChallengeModal
                    onChallenge={handleReset}
                    onModify={handleModify}
                    onFinish={handleFinish}
                />
                }

                {isPleaseCloseModal &&
                    <Modal isOpen={isPleaseCloseModal} onClose={() => setIsPleaseCloseModal(false)}>
                        <div className="p-6">
                            <h2 className="text-2xl font-bold mb-4 text-center">まだ締め切っていません</h2>
                            <p className="text-center">締め切ってから回答を始めてください</p>
                            <div className="flex justify-end mt-6">
                                <Button
                                    onClick={() => setIsPleaseCloseModal(false)}
                                    className=""
                                    value='閉じる'
                                />
                            </div>
                        </div>
                    </Modal>
                }

                {roomStatus.status === "FINISHED" && isAnswerRole &&
                    <FinishModal onFinish={handleFinish} onReset={handleReset}></FinishModal>
                }
            </div>
        </>
    );
}