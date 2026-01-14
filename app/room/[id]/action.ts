import { supabase } from "@/lib/supabase";

// 回答者の登録
export async function setAnswer(roomId: string, userId: string) {
    try{
    const { data, error } = await supabase
    .from('rooms')
    .update({ answerer_id: userId })
    .eq('id', roomId)
    .select()
    .single();

    if (error) {
        console.error('Failed to set answerer:', error);
        return { success: false, error: error.message, data: null };
    }
    return { success: true, error: null, data };
    } catch (error) {
        console.error('Unexpected error:', error);
        return { success: false, error: 'Failed to set answerer', data: null };
    }
}

// export async function POST(request: Request, { params }: { params: { id: string } }) {
//     const { id: roomId } = params;

//     // リクエストボディを取得
//     const body = await request.json();
//     const { user_id, user_name } = body;

//     // presenceからユーザーを削除
//     const channel = supabase.channel(`room_${roomId}`);
//     await channel.untrack({ key: user_id });

//     return new Response(JSON.stringify({ message: 'User removed from presence' }), {
//         status: 200,
//         headers: { 'Content-Type': 'application/json' },
//     });
// }

// export async function GET(request: Request, { params }: { params: { id: string } }) {
//     const { id: roomId } = params;

//     // presenceの現在の状態を取得
//     const channel = supabase.channel(`room_${roomId}`);
//     const state = channel.presenceState();

//     return new Response(JSON.stringify({ presenceState: state }), {
//         status: 200,
//         headers: { 'Content-Type': 'application/json' },
//     });
// }

// export async function getRoom(roomId: string) {
//     try{
//         const { data , error } = await supabase
//         .from('rooms')
//         .select('*')
//         .eq('id', roomId)
//         .single();

//     if (error) {
//         console.error('Failed to fetch room:', error);
//         return { success: false, error: error.message, data: null };
//     }
//     return { success: true, error: null, data };
//     } catch (error) {
//         console.error('Unexpected error:', error);
//         return { success: false, error: 'Failed to fetch room', data: null };
//     }
// }