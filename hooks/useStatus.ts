"use client"

import { useEffect , useState } from "react";
import { supabase } from "@/lib/supabase";

/**
 * ルームステータスの状態を管理するカスタムフック
 * 
 * useEffectでsupabaseの更新処理を検知して状態の変更
 * 
 * useState roomStatus
 * 
 */
export default function useStatus(roomId: string) {
    const [ roomStatus , setRoomStatus ] = useState<{ status: string }>({ status: 'WAITING' });


    // ステータス変更を検知した処理
        useEffect(() => {
            const fetchRoomStatus = async () => {
                const { data, error } = await supabase
                    .from('rooms')
                    .select('status')
                    .eq('id', roomId)
                    .single();
    
                if (error) {
                    console.error('Failed to fetch room status:', error);
                    return;
                }
    
                if (data) {
                    setRoomStatus({ status: data.status });
                }
            };
    
            fetchRoomStatus();
    
            const subscription = supabase
                .channel('public:rooms')
                .on(
                    'postgres_changes',
                    { event: 'UPDATE', schema: 'public', table: 'rooms', filter: `id=eq.${roomId}` },
                    (payload) => {
                        console.log('Room status updated:', payload.new.status);
                        const newStatus = payload.new.status;
                        setRoomStatus({ status: newStatus });
                    }
                )
                .subscribe();
    
            return () => {
                supabase.removeChannel(subscription);
            };
        }, [])

    return { roomStatus };

}