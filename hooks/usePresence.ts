import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

type PresenceUser = {
  user_id: string
  user_name: string
  joined_at: string
}

export const usePresence = (roomId: string, userId: string, userName: string) => {
  const [users, setUsers] = useState<PresenceUser[]>([])
  const [isConnected, setIsConnected] = useState(false)

  useEffect(() => {
    if (!roomId || !userId || !userName) {
      console.log('必要な情報が未設定:', { roomId, userId, userName })
      return
    }

    console.log('チャンネル接続開始:', { roomId, userId, userName })

    // 1. 部屋ごとのチャンネルを作成
    const channel = supabase.channel(`room_${roomId}`, {
      config: { 
        presence: { 
          key: userId  // ユーザーIDをキーとして使用
        } 
      }
    })

    channel
      .on('presence', { event: 'sync' }, () => {
        // 2. 誰かが入退室した時に同期される
        const state = channel.presenceState<PresenceUser>()
        // オブジェクト形式を配列形式に変換して状態を更新
        const usersList = Object.values(state).flatMap(presences => presences)
        setUsers(usersList)
        console.log('現在の参加者:', usersList)
      })
      .on('presence', { event: 'join' }, ({ key, newPresences }) => {
        console.log('参加:', key, newPresences)
      })
      .on('presence', { event: 'leave' }, ({ key, leftPresences }) => {
        console.log('退出:', key, leftPresences)
      })
      .subscribe(async (status) => {
        console.log('接続ステータス:', status)
        if (status === 'SUBSCRIBED') {
          setIsConnected(true)
          // 3. 自分の情報をトラック（送信）
          await channel.track({
            user_id: userId,
            user_name: userName,
            joined_at: new Date().toISOString(),
          })
          console.log('トラック完了:', { userId, userName })
        } else if (status === 'CHANNEL_ERROR') {
          console.error('チャンネル接続エラー')
          setIsConnected(false)
        } else if (status === 'TIMED_OUT') {
          console.error('接続タイムアウト')
          setIsConnected(false)
        }
      })

    // クリーンアップ（退出時に接続を切る）
    return () => {
      console.log('チャンネル切断:', userName)
      channel.untrack()
      channel.unsubscribe()
    }
  }, [roomId, userId, userName]) // userIdとuserNameの両方を依存配列に追加

  return { users, isConnected }
}
