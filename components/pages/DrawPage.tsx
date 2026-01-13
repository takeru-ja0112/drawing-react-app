"use client";

import { Layer, Rect, Stage, Line , Circle} from "react-konva";
import { use, useEffect, useRef, useState } from 'react';
import { saveDrawing } from '@/app/room/[id]/drawing/action';
import { getOrCreateUser , getUsername } from '@/lib/user';

type DrawPageProps = {
    roomId: string;
};

export default function DrawPage({ roomId }: DrawPageProps) {
    const [ count , setCount ] = useState(0);
    const [ isSaving, setIsSaving ] = useState(false);
    const [ saveMessage, setSaveMessage ] = useState<string>('');
    const [ userName, setUserName ] = useState<string>('');
    const linesHistory = useRef<Array<number[][]>>([]);
    const circlesHistory = useRef<Array<Array<{x: number; y: number; radius: number}>>>([]);
    const historyStep = useRef(0);
    const isDrawing = useRef(false);
    const [lines, setLines] = useState<number[][]>([]);
    const [ circles , setCircles ] = useState<
        Array<{
            x: number;
            y: number;
            radius: number;
        }>
    >([]);

    const [ tool , setTool ] = useState<'pen' | 'circle'>('pen');

    const w = 300;
    const h = 300;

    const handleMouseDown = (e: any) => {
        setCount((prev) => prev + 1);
        const point = e.target.getStage()?.getPointerPosition();
        isDrawing.current = true;

        if (tool === 'pen') {
            // 直線の開始点と終了点（最初は同じ点）
            setLines((prev) => [...prev, [point.x, point.y, point.x, point.y]]);
        } else if (tool === 'circle') {
            setCircles((prev) => [...prev, { x: point.x, y: point.y, radius: 0 }]);
        }
    }

    const handleMouseMove = (e: any) => {

        if (isDrawing.current === false) return;
        const lastIdx = lines.length - 1;

        const point = e.target.getStage().getPointerPosition();

            if (tool === 'pen') {
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
                    {...circles[lastCircleIdx] , radius }
                ]);
            }
        };

    const handleMouseUp = () => {
        isDrawing.current = false;

        const newLinesHistory = linesHistory.current.slice(0, historyStep.current + 1);
        const newCirclesHistory = circlesHistory.current.slice(0, historyStep.current + 1);
        
        newLinesHistory.push([...lines]);
        newCirclesHistory.push([...circles]);

        linesHistory.current = newLinesHistory;
        circlesHistory.current = newCirclesHistory;
        historyStep.current = newLinesHistory.length - 1;
    }

    const handleUndo = () => {
        if (historyStep.current === 0) return;
        setCount((prev) => prev - 1);

        historyStep.current -= 1;
        const previousLines = linesHistory.current[historyStep.current];
        const previousCircles = circlesHistory.current[historyStep.current];
        setLines(previousLines);
        setCircles(previousCircles);
    }

    const handleRedo = () => {
        if (historyStep.current === linesHistory.current.length - 1) return;
        setCount((prev) => prev + 1);

        historyStep.current += 1;
        const nextLines = linesHistory.current[historyStep.current];
        const nextCircles = circlesHistory.current[historyStep.current];
        setLines(nextLines);
        setCircles(nextCircles);
    }

    useEffect(() => {
        linesHistory.current = [[...lines]];
        circlesHistory.current = [[...circles]];
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
                circles
            };

            const result = await saveDrawing(roomId, user.id, canvasData , userName);

            if (result.success) {
                const action = result.isUpdate ? '更新' : '保存';
                setSaveMessage(`✅ ${action}成功！要素数: ${lines.length + circles.length}`);
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
            <h1>{count}</h1>
            <div className="mb-4">
                <button onClick={handleUndo} className="border border-black px-2 py-1 mr-2 rounded">Undo</button>
                <button onClick={handleRedo} className="border border-black px-2 py-1 rounded">Redo</button>
                <button 
                    onClick={handleSave} 
                    disabled={isSaving || (lines.length === 0 && circles.length === 0)}
                    className="border border-green-600 bg-green-500 text-white px-4 py-1 rounded ml-4 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isSaving ? '保存中...' : '💾 保存'}
                </button>
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
                        value="pen" 
                        checked={tool === 'pen'} 
                        onChange={() => setTool('pen')} 
                        className="mr-1"
                    />
                    Pen
                </label>
                <label>
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
            </div>
            <div className={`mt-4 border border-black w-[300px] h-[300px] touch-none rounded overflow-hidden`}>
                <Stage width={w} height={h} onMouseDown={handleMouseDown} onMouseMove={handleMouseMove} onMouseUp={handleMouseUp} onTouchStart={handleMouseDown} onTouchMove={handleMouseMove} onTouchEnd={handleMouseUp}>
                    <Layer 
                        tension = {0.5}
                        lineCap = "round"
                        lineJoin = "round"
                    >
                        {lines.map((line, i) => (
                            <Line key={i} points={line} stroke="black" />
                        ))}
                        {circles.map((circle, i) => (
                            <Circle key={i} x={circle.x} y={circle.y} radius={circle.radius} stroke="black" />
                        ))}
                    </Layer>
                </Stage>
            </div>
        </>
    )

}