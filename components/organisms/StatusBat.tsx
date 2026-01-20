"use client";

import Loading from '@/components/atoms/Loading';

export default function StatusBar({ status }: { status: string }) {
    let statusValue = "";
    switch (status) {
        case "WAITING":
            statusValue = "回答者を待っています";
            break;
        case "DRAWING":
            statusValue = "お題に沿ってお絵描き中です";
            break;
        case "ANSWERING":
            statusValue = "回答中です";
            break;
        case "FINISHED":
            statusValue = "終了しました";
            break;
        case "RESETTING":
            statusValue = "リセット中です";
            break;
        default:
            break;
    }

    return (
        <div className="mb-3 text-center bg-yellow-400 py-2 rounded-3xl w-full max-w-lg">
            <h1 className='font-bold flex items-center justify-center'>
                {status === 'DRAWING' && (
                    <Loading className="mr-2" />
                )}
                {statusValue}

            </h1>
        </div>
    );
}