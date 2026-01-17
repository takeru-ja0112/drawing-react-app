"use client";

import { useState , useEffect } from 'react';

export default function StatusBar({ status }: { status: string }) {
    const [ statusValue, setStatusValue ] = useState<string>(status);

    useEffect(() => {
        // ステータス表示部分
    switch (status) {
        case "WAITING":
            setStatusValue("参加者を待っています");
            break;
        case "DRAWING":
            setStatusValue("お題に沿ってお絵描き中です");
            break;
        case "ANSWERING":
            setStatusValue("回答中です");
            break;
        case "FINISHED":
            setStatusValue("終了しました");
            break;
        case "RESETTING":
            setStatusValue("リセット中です");
            break;
        
        default:
            break;
    }
    }, [status]);
    
    return (
        <div className="mb-3 text-center bg-yellow-400 py-2 rounded-3xl w-full max-w-lg">
            <h1 className='font-bold'>{statusValue}</h1>
        </div>
    );
}