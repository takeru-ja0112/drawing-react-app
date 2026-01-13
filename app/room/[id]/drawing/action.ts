"use server";

import { supabase } from '@/lib/supabase';
import { use } from 'react';

export type CanvasData = {
  lines: number[][];
  circles: Array<{x: number; y: number; radius: number}>;
};

// 描画データを保存（room_idとuser_nameが一致する場合は更新）
export async function saveDrawing(
  roomId: string,
  userId: string,
  canvasData: CanvasData,
  userName : string
) {
  try {
    // 要素数を計算
    const elementCount = canvasData.lines.length + canvasData.circles.length;

    // 既存のデータをチェック（room_idとuser_nameで検索）
    const { data: existing, error: fetchError } = await supabase
      .from('drawings')
      .select('id')
      .eq('room_id', roomId)
      .eq('user_name', userName)
      .maybeSingle();

    if (fetchError && fetchError.code !== 'PGRST116') {
      console.error('Failed to check existing drawing:', fetchError);
      return { success: false, error: fetchError.message, data: null };
    }

    let data, error;

    if (existing) {
      // 既存データがあれば更新
      const result = await supabase
        .from('drawings')
        .update({
          user_id: userId,
          canvas_data: canvasData,
          element_count: elementCount,
        })
        .eq('id', existing.id)
        .select()
        .single();
      
      data = result.data;
      error = result.error;
    } else {
      // 既存データがなければ新規挿入
      const result = await supabase
        .from('drawings')
        .insert({
          room_id: roomId,
          user_id: userId,
          user_name: userName,
          canvas_data: canvasData,
          element_count: elementCount,
        })
        .select()
        .single();
      
      data = result.data;
      error = result.error;
    }

    if (error) {
      console.error('Failed to save drawing:', error);
      return { success: false, error: error.message, data: null };
    }

    return { success: true, error: null, data, isUpdate: !!existing };
  } catch (error) {
    console.error('Unexpected error:', error);
    return { success: false, error: 'Failed to save drawing', data: null };
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
