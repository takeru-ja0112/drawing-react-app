"use client"

import { supabase } from "@/lib/supabase";
import { useEffect, useState } from "react";

interface UseStatusType {
    status: string;
    theme:string;
    answerId: string;
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
    const [ roomData , setRoomData ] = useState<UseStatusType>({ status: 'WAITING' , theme: '', answerId: '' });


    // ステータス変更を検知した処理
        useEffect(() => {
            const fetchRoomStatus = async () => {
                const { data, error } = await supabase
                    .from('rooms')
                    .select('status , current_theme, answer_id')
                    .eq('id', roomId)
                    .single();
    
                if (error) {
                    console.error('Failed to fetch room status:', error);
                    return;
                }
    
                if (data) {
                    setRoomData({ status: data.status, theme: data.current_theme, answerId: data.answer_id } );
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
                        setRoomData({ status: newStatus , theme: payload.new.current_theme, answerId: payload.new.answer_id });
                    }
                )
                .subscribe();
    
            return () => {
                supabase.removeChannel(subscription);
            };
        }, [roomId]);

    return { 
        status : roomData.status,
        currentTheme: roomData.theme,
        answerId: roomData.answerId
     };
}