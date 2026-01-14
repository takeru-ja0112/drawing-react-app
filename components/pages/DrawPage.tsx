"use client";

import { Layer, Rect as KonvaRect, Stage, Line, Circle } from "react-konva";
import { use, useEffect, useRef, useState } from 'react';
import { saveDrawing } from '@/app/room/[id]/drawing/action';
import { getOrCreateUser, getUsername } from '@/lib/user';
import Button from '@/components/atoms/Button';

type DrawPageProps = {
    roomId: string;
};

export default function DrawPage({ roomId }: DrawPageProps) {
    const [count, setCount] = useState(0);
    const [isSaving, setIsSaving] = useState(false);
    const [saveMessage, setSaveMessage] = useState<string>('');
    const [userName, setUserName] = useState<string>('');
    const linesHistory = useRef<Array<number[][]>>([]);
    const circlesHistory = useRef<Array<Array<{ x: number; y: number; radius: number }>>>([]);
    const rectsHistory = useRef<Array<Array<{ x: number; y: number; width: number; height: number; rotation: number }>>>([]);
    const historyStep = useRef(0);
    const isDrawing = useRef(false);
    const [lines, setLines] = useState<number[][]>([]);
    const [circles, setCircles] = useState<
        Array<{
            x: number;
            y: number;
            radius: number;
        }>
    >([]);
    const [rects, setRects] = useState<
        Array<{
            x: number;
            y: number;
            width: number;
            height: number;
            rotation: number;
        }>
    >([]);

    const [tool, setTool] = useState<'line' | 'circle' | 'rect'>('line');

    const w = 300;
    const h = 300;

    const handleMouseDown = (e: any) => {
        setCount((prev) => prev + 1);
        const point = e.target.getStage()?.getPointerPosition();
        isDrawing.current = true;

        if (tool === 'line') {
            // 直線の開始点と終了点（最初は同じ点）
            setLines((prev) => [...prev, [point.x, point.y, point.x, point.y]]);
        } else if (tool === 'circle') {
            setCircles((prev) => [...prev, { x: point.x, y: point.y, radius: 0 }]);
        } else if (tool === 'rect') {
            setRects((prev) => [...prev, { x: point.x, y: point.y, width: 0, height: 0, rotation: 0 }]);
        }
    }

    const handleMouseMove = (e: any) => {

        if (isDrawing.current === false) return;

        const point = e.target.getStage().getPointerPosition();

        if (tool === 'line') {
            const lastIdx = lines.length - 1;
            // 直線の終了点のみを更新（開始点はそのまま）
            const startX = lines[lastIdx][0];
            const startY = lines[lastIdx][1];
            setLines((prev) => [
                ...prev.slice(0, lastIdx),
                [startX, startY, point.x, point.y]
            ]);
        } else if (tool === 'circle') {
            const lastCircleIdx = circles.length - 1;
            const radius = Math.hypot(point.x - circles[lastCircleIdx].x, point.y - circles[lastCircleIdx].y);
            setCircles((prev) => [
                ...prev.slice(0, lastCircleIdx),
                { ...circles[lastCircleIdx], radius }
            ]);
        } else if (tool === 'rect') {
            const lastRectIdx = rects.length - 1;
            const rect = rects[lastRectIdx];
            const dx = point.x - rect.x;
            const dy = point.y - rect.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            const width = Math.max(1, distance);
            const height = Math.max(1, distance);
            const rotation = Math.atan2(dy, dx) * (180 / Math.PI);
            setRects((prev) => [
                ...prev.slice(0, lastRectIdx),
                { ...rect, width, height, rotation }
            ]);
        }
    };

    const handleMouseUp = () => {
        isDrawing.current = false;

        const newLinesHistory = linesHistory.current.slice(0, historyStep.current + 1);
        const newCirclesHistory = circlesHistory.current.slice(0, historyStep.current + 1);
        const newRectsHistory = rectsHistory.current.slice(0, historyStep.current + 1);

        newLinesHistory.push([...lines]);
        newCirclesHistory.push([...circles]);
        newRectsHistory.push([...rects]);

        linesHistory.current = newLinesHistory;
        circlesHistory.current = newCirclesHistory;
        rectsHistory.current = newRectsHistory;
        historyStep.current = newLinesHistory.length - 1;
    }

    const handleUndo = () => {
        if (historyStep.current === 0) return;
        setCount((prev) => prev - 1);

        historyStep.current -= 1;
        const previousLines = linesHistory.current[historyStep.current];
        const previousCircles = circlesHistory.current[historyStep.current];
        const previousRects = rectsHistory.current[historyStep.current];
        setLines(previousLines);
        setCircles(previousCircles);
        setRects(previousRects);
    }

    const handleRedo = () => {
        if (historyStep.current === linesHistory.current.length - 1) return;
        setCount((prev) => prev + 1);

        historyStep.current += 1;
        const nextLines = linesHistory.current[historyStep.current];
        const nextCircles = circlesHistory.current[historyStep.current];
        const nextRects = rectsHistory.current[historyStep.current];
        setLines(nextLines);
        setCircles(nextCircles);
        setRects(nextRects);
    }

    useEffect(() => {
        linesHistory.current = [[...lines]];
        circlesHistory.current = [[...circles]];
        rectsHistory.current = [[...rects]];
        historyStep.current = 0;

        // クライアント側でユーザー名を取得
        const name = getUsername();
        if (name) {
            setUserName(name);
        }

        const handleGlobalMouseUp = () => {
            isDrawing.current = false;
        }

        document.addEventListener('mouseup', handleGlobalMouseUp);

        return () => {
            document.removeEventListener('mouseup', handleGlobalMouseUp);
        }
    }, []);

    const handleSave = async () => {
        setIsSaving(true);
        setSaveMessage('');

        try {
            // ユーザー情報を取得
            const user = getOrCreateUser();

            const canvasData = {
                lines,
                circles,
                rects
            };

            const result = await saveDrawing(roomId, user.id, canvasData, userName);

            if (result.success) {
                const action = result.isUpdate ? '更新' : '保存';
                setSaveMessage(`✅ ${action}成功！要素数: ${lines.length + circles.length + rects.length}`);
            } else {
                setSaveMessage(`❌ 保存失敗: ${result.error}`);
            }
        } catch (error) {
            setSaveMessage(`❌ エラー: ${error}`);
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <>
            <div className="min-h-screen p-8 bg-gray-200">
                <div className="max-w-4xl mx-auto text-center">

                    <h1>{count}</h1>
                    <div className="mb-4">
                        <button onClick={handleUndo} className="border border-black px-2 py-1 mr-2 rounded">Undo</button>
                        <button onClick={handleRedo} className="border border-black px-2 py-1 rounded">Redo</button>
                    </div>

                    {saveMessage && (
                        <div className="mb-4 p-2 bg-gray-100 rounded">
                            {saveMessage}
                        </div>
                    )}

                    {/* Tool selection */}
                    <div className="mt-4">
                        <label className="mr-4">
                            <input
                                type="radio"
                                name="tool"
                                value="line"
                                checked={tool === 'line'}
                                onChange={() => setTool('line')}
                                className="mr-1"
                            />
                            line
                        </label>
                        <label className="mr-4">
                            <input
                                type="radio"
                                name="tool"
                                value="circle"
                                checked={tool === 'circle'}
                                onChange={() => setTool('circle')}
                                className="mr-1"
                            />
                            Circle
                        </label>
                        <label>
                            <input
                                type="radio"
                                name="tool"
                                value="rect"
                                checked={tool === 'rect'}
                                onChange={() => setTool('rect')}
                                className="mr-1"
                            />
                            Rectangle
                        </label>
                    </div>
                    <div className={`mx-auto mt-4 border border-black w-[300px] h-[300px] touch-none rounded overflow-hidden`}>
                        <Stage width={w} height={h} onMouseDown={handleMouseDown} onMouseMove={handleMouseMove} onMouseUp={handleMouseUp} onTouchStart={handleMouseDown} onTouchMove={handleMouseMove} onTouchEnd={handleMouseUp}>
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
                    <div className="mt-3">
                        <Button
                            onClick={handleSave}
                            disabled={isSaving || (lines.length === 0 && circles.length === 0 && rects.length === 0)}
                            className="w-full border border-green-600 bg-green-500 text-white px-4 py-1 rounded ml-4 disabled:opacity-50 disabled:cursor-not-allowed"
                            value={isSaving ? '保存中...' : '💾 保存'}
                        />
                    </div>
                </div>
            </div>
        </>
    )

}