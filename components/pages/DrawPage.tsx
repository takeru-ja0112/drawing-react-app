"use client";

import { Layer, Rect as KonvaRect, Stage, Line, Circle } from "react-konva";
import useDraw from '@/hooks/DrawPage/handleDraw';
import Button from '@/components/atoms/Button';
import { motion } from "motion/react";
import { TbArrowForwardUp, TbArrowBackUp, TbTrash } from 'react-icons/tb';
import { IconContext } from "react-icons";
import { useCallback, useState } from "react";
import Modal from "@/components/organisms/Modal";
import { useEffect } from "react";
import { useBlocker } from "@/hooks/useBlocker";
import useStatus from "@/hooks/useStatus";
import { KonvaEventObject } from "konva/lib/Node";

type DrawPageProps = {
    roomId: string;
    theme?: string;
    mode?: 'demo';
};

export default function DrawPage({ roomId, theme, mode }: DrawPageProps) {
    const {
        count,
        isSaving,
        saveMessage,
        lines,
        circles,
        rects,
        tool,
        setTool,
        handleMouseDown,
        handleMouseMove,
        handleMouseUp,
        handleUndo,
        handleRedo,
        handleReset,
        handleSave,
        saveToSessionStorage,
        getToSessionStorage,
        w,
        h,
    } = useDraw(roomId);
    const [isSaveOpen, setIsSaveOpen] = useState(false);
    const [isThemeOpen, setIsThemeOpen] = useState(true);
    const [isBlocked, setIsBlocked] = useState(true);
    useBlocker(() => { }, isBlocked);
    const { roomStatus } = useStatus(roomId);

    const memoGetToSessionStorage = useCallback(() => {
        getToSessionStorage();
    }, [getToSessionStorage]);

    useEffect(() => {
        memoGetToSessionStorage();
    }, []);

    return (
        <>
            <div className="px-8 pt-2 pb-16">
                <div className="max-w-lg mx-auto text-center">
                    {/* お題 */}
                    <label className="block mb-1 font-semibold text-gray-600">
                        お題
                    </label>
                    <h1 className="text-xl font-bold">{isThemeOpen ? '' : theme}</h1>

                    <motion.h1
                        key={count}
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-4xl font-bold mb-4 "
                    >
                        {count}
                    </motion.h1>
                    <div className="mb-4">
                        <IconContext.Provider value={{ size: '1.5em' }}>
                            <Button onClick={handleUndo} className="border border-black px-2 py-1 mr-2 rounded" icon={<TbArrowBackUp />} />
                            <Button onClick={handleRedo} className="border border-black px-2 py-1 mr-2 rounded" icon={<TbArrowForwardUp />} />
                            <Button onClick={handleReset} className="border border-black px-2 py-1 rounded" icon={<TbTrash />} value="リセット" />
                        </IconContext.Provider>
                    </div>


                    {/* Tool selection - カード風デザイン */}
                    <div className="mt-4 flex gap-4 justify-center">
                        {[
                            {
                                key: 'line', label: 'Line', icon: (
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><line x1="4" y1="20" x2="20" y2="4" stroke="currentColor" strokeWidth="2" /></svg>
                                )
                            },
                            {
                                key: 'circle', label: 'Circle', icon: (
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="2" /></svg>
                                )
                            },
                            {
                                key: 'rect', label: 'Rectangle', icon: (
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><rect x="4" y="4" width="16" height="16" rx="3" stroke="currentColor" strokeWidth="2" /></svg>
                                )
                            },
                        ].map(({ key, label, icon }) => (
                            <motion.label
                                key={key}
                                whileHover={{ scale: 1.08 }}
                                whileTap={{ scale: 0.97 }}
                                animate={{
                                    boxShadow: tool === key ? '0 0 0 2px #08071cff' : '0 0 0 1px #d1d5db',
                                    backgroundColor: tool === key ? '#ffcd44ff' : '#fff',
                                }}
                                className={`w-full flex flex-col items-center px-4 py-2 rounded-lg cursor-pointer border ${tool === key ? 'border-gray-500' : 'border-gray-300'}`}
                            >
                                <input
                                    type="radio"
                                    name="tool"
                                    value={key}
                                    checked={tool === key}
                                    onChange={() => setTool(key as typeof tool)}
                                    className="hidden"
                                />
                                <span className="mb-1 text-xl">{icon}</span>
                                <span className={`text-sm font-semibold ${tool === key ? 'text-gray-900' : 'text-gray-400'}`}>{label}</span>
                            </motion.label>
                        ))}
                    </div>
                    <div className={`mx-auto mt-4 border bg-white border-4 border-gray-400 w-[300px] h-[300px] touch-none rounded overflow-hidden`}>
                        <Stage
                            width={w}
                            height={h}
                            onMouseDown={handleMouseDown}
                            onMouseMove={handleMouseMove}
                            onMouseUp={handleMouseUp}
                            onTouchStart={(e: KonvaEventObject<TouchEvent>) => handleMouseDown(e)}
                            onTouchMove={(e: KonvaEventObject<TouchEvent>) => handleMouseMove(e)}
                            onTouchEnd={(e: KonvaEventObject<TouchEvent>) => handleMouseUp()}
                            >
                            <Layer
                                tension={0.5}
                                lineCap="round"
                                lineJoin="round"
                            >
                                {lines.map((line, i) => (
                                    <Line key={i} points={line} stroke="black" />
                                ))}
                                {circles.map((circle, i) => (
                                    <Circle key={i} x={circle.x} y={circle.y} radius={circle.radius} stroke="black" />
                                ))}
                                {rects.map((rect, i) => (
                                    <KonvaRect key={i} x={rect.x} y={rect.y} width={rect.width} height={rect.height} stroke="black" rotation={rect.rotation} />
                                ))}
                            </Layer>
                        </Stage>
                    </div>
                </div>
                {mode === 'demo' ? null :
                    <motion.div
                        className="px-8 w-80 bottom-5 fixed left-1/2 transform -translate-x-1/2"
                    >
                        <Button
                            onClick={() => setIsSaveOpen(!isSaveOpen)}
                            disabled={isSaving || (lines.length === 0 && circles.length === 0 && rects.length === 0)}
                            className="w-full disabled:opacity-50 disabled:cursor-not-allowed"
                            value={isSaving ? '保存中...' : '保存'}
                        />
                    </motion.div>
                }
                {saveMessage && (
                    <div className="mb-4 p-2 bg-gray-100 rounded">
                        {saveMessage}
                    </div>
                )}
                {isSaveOpen && (
                    <Modal
                        isOpen={true}
                        onClose={() => setIsSaveOpen(false)}
                    >
                        <h2 className="text-xl font-semibold mb-4">保存しますか？</h2>
                        <p>保存が完了次第、自動で回答ページに移動します。</p>
                        <div className="flex justify-end gap-4">
                            <button
                                onClick={() => setIsSaveOpen(false)}
                                className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg mr-2"
                            >
                                キャンセル
                            </button>
                            <Button
                                onClick={() => {
                                    handleSave();
                                    setIsSaveOpen(false);
                                    setIsBlocked(false);
                                    saveToSessionStorage();
                                }}
                                value={isSaving ? '保存中...' : '保存する'}
                                disabled={isSaving}
                            />
                        </div>
                    </Modal>
                )}
                {mode === 'demo' ? null : <Modal isOpen={isThemeOpen} onClose={() => setIsThemeOpen(false)}>
                    <h2 >お題</h2>
                    <p className="font-bold text-xl my-4">{theme}</p>
                    <Button
                        onClick={() => setIsThemeOpen(false)}
                        className="mt-2"
                        value="確認しました"
                    />
                </Modal>
                }

                {roomStatus.status === 'ANSWERING' && (
                    <Modal
                        isOpen={true}
                        onClose={() => {
                            window.location.href = `/room/${roomId}/answer`;

                        }}
                    >
                        <h1 className="text-xl font-semibold mb-4">回答者が締め切りました</h1>
                        <p>回答ページに移動します</p>
                        <Button
                            onClick={() => {
                                window.location.href = `/room/${roomId}/answer`;
                            }}
                            className="mt-4"
                            value="OK"
                        />
                    </Modal>
                )}
            </div>
        </>
    );
}