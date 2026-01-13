import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

type Room = {
  id: string
  status: string
  current_theme: string | null
  answerer_id: string | null
}

// ルームの変更をリアルタイムで監視するフック
export function useRoomRealtime(roomId: string) {
  const [room, setRoom] = useState<Room | null>(null)

  useEffect(() => {
    if (!roomId) return

    // 初回データ取得
    const fetchRoom = async () => {
      const { data } = await supabase
        .from('rooms')
        .select('*')
        .eq('id', roomId)
        .single()
      
      if (data) setRoom(data)
    }

    fetchRoom()

    // リアルタイム監視を設定
    const channel = supabase
      .channel(`room_changes_${roomId}`)
      .on(
        'postgres_changes',
        {
          event: '*', // INSERT, UPDATE, DELETE すべてを監視
          schema: 'public',
          table: 'rooms',
          filter: `id=eq.${roomId}` // 特定のルームのみ
        },
        (payload) => {
          console.log('ルームが更新されました:', payload)
          
          if (payload.eventType === 'UPDATE') {
            setRoom(payload.new as Room)
          } else if (payload.eventType === 'DELETE') {
            setRoom(null)
          }
        }
      )
      .subscribe()

    return () => {
      channel.unsubscribe()
    }
  }, [roomId])

  return { room }
}

// 描画データの変更を監視するフック
export function useDrawingsRealtime(roomId: string) {
  const [drawings, setDrawings] = useState<any[]>([])

  useEffect(() => {
    if (!roomId) return

    // 初回データ取得
    const fetchDrawings = async () => {
      const { data } = await supabase
        .from('drawings')
        .select('*')
        .eq('room_id', roomId)
        .order('element_count', { ascending: true })
      
      if (data) setDrawings(data)
    }

    fetchDrawings()

    // リアルタイム監視
    const channel = supabase
      .channel(`drawings_changes_${roomId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT', // INSERTのみ監視
          schema: 'public',
          table: 'drawings',
          filter: `room_id=eq.${roomId}`
        },
        (payload) => {
          console.log('新しい描画が追加されました:', payload)
          setDrawings(prev => [...prev, payload.new].sort((a, b) => a.element_count - b.element_count))
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'DELETE',
          schema: 'public',
          table: 'drawings',
          filter: `room_id=eq.${roomId}`
        },
        (payload) => {
          console.log('描画が削除されました:', payload)
          setDrawings(prev => prev.filter(d => d.id !== payload.old.id))
        }
      )
      .subscribe()

    return () => {
      channel.unsubscribe()
    }
  }, [roomId])

  return { drawings }
}
