"use client";

import { useRef, useState } from 'react';
import { saveDrawing } from '@/app/room/[id]/drawing/action';
import { getOrCreateUser, getUsername } from '@/lib/user';
import { useRouter } from 'next/navigation';
import { KonvaEventObject } from 'konva/lib/Node';

export default function useDraw(roomId: string) {
    const canvasData = JSON.parse(sessionStorage.getItem(`drawing_${roomId}`) || 'null');
    const [count, setCount] = useState<number>(canvasData ? canvasData.element : 0);
    const [isSaving, setIsSaving] = useState(false);
    const [saveMessage, setSaveMessage] = useState<string>('');
    const [ userName ] = useState<string>(getUsername() || getOrCreateUser().username);
    const historyStep = useRef(0);
    const isDrawing = useRef(false);
    const [lines, setLines] = useState<number[][]>(canvasData?.lines || []);
    const [circles, setCircles] = useState<
    Array<{
        x: number;
        y: number;
        radius: number;
    }>
    >(canvasData?.circles || []);
    const [rects, setRects] = useState<
    Array<{
        x: number;
        y: number;
        width: number;
        height: number;
        rotation: number;
    }>
    >(canvasData?.rects || []);
    const linesHistory = useRef<Array<number[][]>>([[...lines]]);
    const circlesHistory = useRef<Array<Array<{ x: number; y: number; radius: number }>>>([[...circles]]);
    const rectsHistory = useRef<Array<Array<{ x: number; y: number; width: number; height: number; rotation: number }>>>([[...rects]]);
    const router = useRouter();


    // デバウンス用タイマーref
    const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const [tool, setTool] = useState<'line' | 'circle' | 'rect'>('line');

    const w = 300;
    const h = 300;

    const handleMouseDown = (e: KonvaEventObject<MouseEvent | TouchEvent>) => {
        setCount((prev) => prev + 1);
        const point = e.target.getStage()?.getPointerPosition();
        isDrawing.current = true;
        if (!point) return;

        if (tool === 'line') {
            // 直線の開始点と終了点（最初は同じ点）
            setLines((prev) => [...prev, [point.x, point.y, point.x, point.y]]);
        } else if (tool === 'circle') {
            setCircles((prev) => [...prev, { x: point.x, y: point.y, radius: 0 }]);
        } else if (tool === 'rect') {
            setRects((prev) => [...prev, { x: point.x, y: point.y, width: 0, height: 0, rotation: 0 }]);
        }
    }

    const handleMouseMove = (event: KonvaEventObject<MouseEvent | TouchEvent>) => {

        if (isDrawing.current === false) return;

        const point = event.target.getStage()?.getPointerPosition();
        if (!point) return;

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
            const width = dx;
            const height = dy;
            // const rotation = Math.atan2(dy, dx) * (180 / Math.PI);
            setRects((prev) => [
                ...prev.slice(0, lastRectIdx),
                { ...rect, width, height, rotation: 0 }
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
    // デバウンス保存処理
    if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
    }
    saveTimeoutRef.current = setTimeout(() => {
        console.log("データを保存します");
        saveToSessionStorage();
    }, 500); // 0.5秒後に保存

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

    // 初期読み込みしてから履歴も更新する
    const handleInitializeHistory = () => {
        linesHistory.current = [[...lines]];
        circlesHistory.current = [[...circles]];
        rectsHistory.current = [[...rects]];
        historyStep.current = 0;
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

    const handleReset = () => {
        setCount(0);
        linesHistory.current = [[]];
        circlesHistory.current = [[]];
        rectsHistory.current = [[]];
        historyStep.current = 0;
        setLines([]);
        setCircles([]);
        setRects([]);
    }

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
                router.push(`/room/${roomId}/answer`);
            } else {
                setSaveMessage(`保存失敗: ${result.error}`);
            }
        } catch (error) {
            setSaveMessage(`エラー: ${error}`);
        } finally {
            setIsSaving(false);
        }
    };

    // セッションストレージに一時データを保存する処理
    const saveToSessionStorage = () => {
        const canvasData = {
            lines: linesHistory.current[historyStep.current],
            circles: circlesHistory.current[historyStep.current],
            rects: rectsHistory.current[historyStep.current],
            element: lines.length + circles.length + rects.length,
        };
        sessionStorage.setItem(`drawing_${roomId}`, JSON.stringify(canvasData));
    }

    return {
        count,
        isSaving,
        saveMessage,
        userName,
        lines,
        circles,
        rects,
        tool,
        setTool,
        setCount,
        handleMouseDown,
        handleMouseMove,
        handleMouseUp,
        handleInitializeHistory,
        handleUndo,
        handleRedo,
        handleReset,
        handleSave,
        saveToSessionStorage,
        w,
        h,
    };
}