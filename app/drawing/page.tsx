"use client";

import { Layer, Rect, Stage, Line , Circle} from "react-konva";
import { useEffect, useRef, useState } from 'react';
import DrawPage from "@/components/pages/DrawPage";

export default function Page() {
    // テスト用のダミーroomId
    const testRoomId = "test-room-" + Date.now();
    
    return <DrawPage roomId={testRoomId} />
}