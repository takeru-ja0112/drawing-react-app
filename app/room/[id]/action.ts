import { supabase } from "@/lib/supabase";

// ルームのステータスを変更
export async function setStatusRoom(roomId : string , status: 'WATING' | 'DRAWING' | 'ANSWERING' | 'FINISHED') {
    try {
        const { data, error } = await supabase
            .from('rooms')
            .update({ status })
            .eq('id', roomId)
            .select()
            .single();

        if (error) {
            console.error('Failed to update room status:', error);
            return { success: false, error: error.message, data: null };
        }

        return { success: true, error: null, data };
    } catch (error) {
        console.error('Unexpected error:', error);
        return { success: false, error: 'Failed to update room status', data: null };
    }
}

// ルームのステータスを取得
export async function getStatusRoom(roomId : string) {
    try {
        const { data, error } = await supabase
            .from('rooms')
            .select('status')
            .eq('id', roomId)
            .single();

        if (error) {
            console.error('Failed to fetch room status:', error);
            return { success: false, error: error.message, data: null };
        }

        return { success: true, error: null, data: data.status };
    } catch (error) {
        console.error('Unexpected error:', error);
        return { success: false, error: 'Failed to fetch room status', data: null };
    }
}