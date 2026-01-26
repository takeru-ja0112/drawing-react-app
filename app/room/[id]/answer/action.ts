import { supabase } from '@/lib/supabase';

// 回答者が決定しているか確認
export async function isCheckAnswer(roomId: string) {
    try {
        const { data, error } = await supabase
            .from('rooms')
            .select('answer_id')
            .eq('id', roomId)
            .single();

        if (error) {
            console.error('Failed to fetch answerer:', error);
            return { success: false, error: error.message, data: null };
        }

        const isAnswered = data?.answer_id ? true : false;
        return { success: true, error: null, data: isAnswered };
    } catch (error) {
        console.error('Unexpected error:', error);
        return { success: false, error: 'Failed to fetch answerer', data: null };
    }
}

// 回答者の登録
export async function setdbAnswer(roomId: string, userId: string) {
    try {
        // 既に回答者が設定されているか確認
        const { data: roomData, error: roomError } = await supabase
            .from('rooms')
            .select('answer_id')
            .eq('id', roomId)
            .single();

        if (roomError) {
            console.error('Failed to fetch room data:', roomError);
            return { success: false, error: roomError.message, data: null };
        }

        if (roomData?.answer_id) {
            return { success: false, error: 'Answerer already set', data: null };
        }

        // 回答者を設定
        const { data, error } = await supabase
            .from('rooms')
            .update({ answer_id: userId })
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


// 特定ルームの描画データを取得（要素数昇順）
export async function getDrawingsByRoom(roomId: string) {
    try {
        const { data, error } = await supabase
            .from('drawings')
            .select('*')
            .eq('room_id', roomId)
            .order('element_count', { ascending: true });

        if (error) {
            console.error('Failed to fetch drawings:', error);
            return { success: false, error: error.message, data: null };
        }


        return { success: true, error: null, data };
    } catch (error) {
        console.error('Unexpected error:', error);
        return { success: false, error: 'Failed to fetch drawings', data: null };
    }
}

// 画面を見ているユーザーに解答権限があるかどうか確認
export async function checkAnswerRole(roomId: string, userId: string) {
    try {
        const { data: roomData, error: roomError } = await supabase
            .from('rooms')
            .select('answer_id')
            .eq('id', roomId)
            .single();

        if (roomError) {
            console.error('Failed to fetch room data:', roomError);
            return { success: false, error: roomError.message, isAnswerRole: false };
        }

        const isAnswerRole = roomData?.answer_id === userId;
        return { success: true, error: null, isAnswerRole:isAnswerRole };
    } catch (error) {
        console.error('Unexpected error:', error);
        return { success: false, error: 'Failed to check answer role', isAnswerRole: false };
    }
}

// お題を取得
export async function getTheme(roomId: string) {
    try {
        const { data: roomData, error: roomError } = await supabase
            .from('rooms')
            .select('current_theme')
            .eq('id', roomId)
            .single();

        if (roomError) {
            console.error('Failed to fetch room data:', roomError);
            return { success: false, error: roomError.message, data: null };
        }

        return { success: true, error: null, data: roomData?.current_theme || null };
    } catch (error) {
        console.error('Unexpected error:', error);
        return { success: false, error: 'Failed to fetch theme', data: null };
    }
}

// お題の正誤判定のため複数パターンを取得
export async function getThemePatternByRoomId(roomId : string ) {
    const id = roomId;
    let themeId :string = "";

    try{
        const { data, error } = await supabase
            .from('rooms')
            .select('current_theme_id')
            .eq('id', id)
            .single();
        if (error) {
            console.error('Failed to fetch current theme id:', error);
            return { success: false, error: error.message, data: null };
        }

        if (!data) {
            return { success: false, error: 'No current theme id found', data: null };
        }

        themeId = data.current_theme_id;
    }catch (error) {
        console.error('Unexpected error:', error);
        return { success: false, error: 'Failed to fetch current theme id', data: null };
    }

    try {
        const { data, error } = await supabase
            .from('theme')
            .select('*')
            .eq('id', themeId)
            .single();

        if (error) {
            console.error('Failed to fetch theme patterns:', error);
            return { success: false, error: error.message, data: null };
        }

        return { success: true, error: null, data };
    }
    catch (error) {
        console.error('Unexpected error:', error);
        return { success: false, error: 'Failed to fetch theme patterns', data: null };
    }
}

/**
 * 回答の登録
 */
export async function setdbAnswerInput(roomId: string, answer: string) {
    try {
        const { data, error } = await supabase
            .from('answer_inputs')
            .upsert({ text: answer , room_id:roomId })
            .eq('room_id', roomId)
            .select()
            .single();

        if (error) {
            console.error('Failed to set answer input:', error);
            return { success: false, error: error.message, data: null };
        }
        return { success: true, error: null, data };
    } catch (error) {
        console.error('Unexpected error:', error);
        return { success: false, error: 'Failed to set answer input', data: null };
    }
}
/**
 * 回答結果の記録
 */
export async function setdbAnswerResult(roomId: string, result: string) {
    try {
        const { data, error } = await supabase
            .from('answer_inputs')
            .upsert({ result: result , room_id:roomId })
            .eq('room_id', roomId)
            .select()
            .single();

        if (error) {
            console.error('Failed to set answer result:', error);
            return { success: false, error: error.message, data: null };
        }
        return { success: true, error: null, data };
    } catch (error) {
        console.error('Unexpected error:', error);
        return { success: false, error: 'Failed to set answer result', data: null };
    }
}

/**
 * サブスクリプションテーブルに登録
 */
export async function subscribePush(userId: string, subscription: any) {
    try {
        const { data, error } = await supabase
            .from('subscriptions')
            .upsert({ user_id: userId, subscription: subscription })
            .eq('user_id', userId)
            .select()
            .single();

        if (error) {
            console.error('Failed to subscribe push:', error);
            return { success: false, error: error.message, data: null };
        }
        return { success: true, error: null, data };
    } catch (error) {
        console.error('Unexpected error:', error);
        return { success: false, error: 'Failed to subscribe push', data: null };
    }
}

/**
 * サブスクリプションテーブルから削除
 */
export async function unsubscribePush(userId: string) {
    try {
        const { data, error } = await supabase
            .from('subscriptions')
            .delete()
            .eq('user_id', userId);

        if (error) {
            console.error('Failed to unsubscribe push:', error);
            return { success: false, error: error.message, data: null };
        }
        return { success: true, error: null, data };
    } catch (error) {
        console.error('Unexpected error:', error);
        return { success: false, error: 'Failed to unsubscribe push', data: null };
    }
}