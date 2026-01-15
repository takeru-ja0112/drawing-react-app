"use client";

import DrawPage from "@/components/pages/DrawPage";

export default function Page() {
    // テスト用のダミーroomId
    const testRoomId = "test-room-" + Date.now();
    
    return <DrawPage roomId={testRoomId} mode="demo" />
}