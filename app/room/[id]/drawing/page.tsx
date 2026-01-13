"use client";

import { useParams } from 'next/navigation';
import DrawPage from "@/components/pages/DrawPage";

export default function Page() {
    const params = useParams();
    const roomId = params.id as string;

    return <DrawPage roomId={roomId} />;
}