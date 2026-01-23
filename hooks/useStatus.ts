"use client"

import { useEffect , useState } from "react";
import { supabase } from "@/lib/supabase";

interface UseStatusType {
    status: string;
    theme:string;
}

/**
 * ルームステータスの状態を管理するカスタムフック
 * 
 * useEffectでsupabaseの更新処理を検知して状態の変更
 * 
 * useState roomStatus
 * 
 */
export default function useStatus(roomId: string) {
    const [ roomData , setRoomData ] = useState<UseStatusType>({ status: 'WAITING' , theme: '' });


    // ステータス変更を検知した処理
        useEffect(() => {
            const fetchRoomStatus = async () => {
                const { data, error } = await supabase
                    .from('rooms')
                    .select('status , current_theme')
                    .eq('id', roomId)
                    .single();
    
                if (error) {
                    console.error('Failed to fetch room status:', error);
                    return;
                }
    
                if (data) {
                    setRoomData({ status: data.status, theme: data.current_theme } );
                }
            };
    
            fetchRoomStatus();
    
            const subscription = supabase
                .channel('public:rooms')
                .on(
                    'postgres_changes',
                    { event: 'UPDATE', schema: 'public', table: 'rooms', filter: `id=eq.${roomId}` },
                    (payload) => {
                        const newStatus = payload.new.status;
                        setRoomData({ status: newStatus , theme: payload.new.current_theme });
                    }
                )
                .subscribe();
    
            return () => {
                supabase.removeChannel(subscription);
            };
        }, [roomId]);

    return { 
        status : roomData.status,
        currentTheme: roomData.theme
     };
}