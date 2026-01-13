// RSC（React Server Component）用のユーザー管理
// cookieを使用してサーバーサイドでもユーザー情報を取得可能

import { cookies } from 'next/headers';

const USER_ID_KEY = 'drawing_app_user_id';
const USERNAME_KEY = 'drawing_app_username';

// ランダムなユーザー名を生成
function generateUsername(): string {
  const adjectives = ['Red', 'Blue', 'Green', 'Yellow', 'Purple', 'Orange', 'Pink', 'Silver'];
  const nouns = ['Cat', 'Dog', 'Bird', 'Fish', 'Bear', 'Fox', 'Wolf', 'Lion'];
  const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
  const noun = nouns[Math.floor(Math.random() * nouns.length)];
  const num = Math.floor(Math.random() * 100);
  return `${adj}${noun}${num}`;
}

// UUIDを生成（簡易版）
function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

export type UserInfo = {
  id: string;
  username: string;
};

// RSC用: ユーザー情報を取得、なければ新規生成
export async function getOrCreateUserServer(): Promise<UserInfo> {
  const cookieStore = await cookies();
  
  let userId = cookieStore.get(USER_ID_KEY)?.value;
  let username = cookieStore.get(USERNAME_KEY)?.value;
  
  // 初回またはデータがない場合
  if (!userId || !username) {
    userId = generateUUID();
    username = generateUsername();
    
    // cookieに保存（1年間有効）
    cookieStore.set(USER_ID_KEY, userId, {
      maxAge: 60 * 60 * 24 * 365,
      path: '/',
    });
    cookieStore.set(USERNAME_KEY, username, {
      maxAge: 60 * 60 * 24 * 365,
      path: '/',
    });
  }
  
  return { id: userId, username };
}

// RSC用: ユーザーIDのみ取得
export async function getUserIdServer(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get(USER_ID_KEY)?.value || null;
}

// RSC用: ユーザー名のみ取得
export async function getUsernameServer(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get(USERNAME_KEY)?.value || null;
}

// RSC用: ユーザー名を更新
export async function updateUsernameServer(username: string): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(USERNAME_KEY, username, {
    maxAge: 60 * 60 * 24 * 365,
    path: '/',
  });
}

// RSC用: ユーザー情報をクリア
export async function clearUserServer(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(USER_ID_KEY);
  cookieStore.delete(USERNAME_KEY);
}
