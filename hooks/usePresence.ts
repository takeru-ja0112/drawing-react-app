import { useEffect, useState, useRef } from 'react'
import { supabase } from '@/lib/supabase'

type PresenceUser = {
  user_name: string
  joined_at: string
}

export const usePresence = (roomId: string, userName: string) => {
  const [users, setUsers] = useState<PresenceUser[]>([])
  const [isConnected, setIsConnected] = useState(false)
  const userNameRef = useRef(userName)

  // userNameが変更された時だけrefを更新
  useEffect(() => {
    userNameRef.current = userName
  }, [userName])

  useEffect(() => {
    if (!roomId || !userNameRef.current) return

    // 1. 部屋ごとのチャンネルを作成
    const channel = supabase.channel(`room_${roomId}`, {
      config: { 
        presence: { 
          key: userNameRef.current 
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
        if (status === 'SUBSCRIBED') {
          setIsConnected(true)
          // 3. 自分の情報をトラック（送信）
          await channel.track({
            user_name: userNameRef.current,
            joined_at: new Date().toISOString(),
          })
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
      channel.untrack()
      channel.unsubscribe()
    }
  }, [roomId]) // userNameを依存配列から除外

  return { users, isConnected }
}
