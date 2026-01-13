// ユーザーID（UUID）とユーザー名を管理するユーティリティ

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

// ユーザー名を保存
export function setUsername(username: string): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(USERNAME_KEY, username);
}

// ユーザー情報を取得、なければ新規生成
export function getOrCreateUser(): UserInfo {
  if (typeof window === 'undefined') return { id: '', username: '' }; // SSR対応
  
  let userId = localStorage.getItem(USER_ID_KEY);
  let username = localStorage.getItem(USERNAME_KEY);
  
  // 初回またはデータがない場合
  if (!userId || !username) {
    userId = generateUUID();
    username = generateUsername();
    localStorage.setItem(USER_ID_KEY, userId);
    localStorage.setItem(USERNAME_KEY, username);
  }
  
  return { id: userId, username };
}

// ユーザー名を更新
export function updateUsername(username: string): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(USERNAME_KEY, username);
}

// ユーザー情報をクリア
export function clearUser(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(USER_ID_KEY);
  localStorage.removeItem(USERNAME_KEY);
}

// ユーザーIDのみ取得
export function getUserId(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(USER_ID_KEY);
}

// ユーザー名のみ取得
export function getUsername(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(USERNAME_KEY);
}
