import { z } from 'zod';

// ユーザーID（UUID）とユーザー名を管理するユーティリティ

const USER_ID_KEY = 'drawing_app_user_id';
const USERNAME_KEY = 'drawing_app_username';

const forbiddenChars = /[<>&\/\\'"]/;
const usernameSchema = z.string().max(10).refine((val) => !forbiddenChars.test(val), {
  message: 'ユーザー名に使用できない文字が含まれています。',
});

export const generateUser = () => {
  if (typeof window === 'undefined') return { id: '', username: '' }; // SSR対応

  let userId = localStorage.getItem(USER_ID_KEY);
  let username = localStorage.getItem(USERNAME_KEY);

  // 初回またはデータがない場合
  if (!userId) {
    userId = generateUUID();
    localStorage.setItem(USER_ID_KEY, userId);
  }
  if (!username) {
    username = ``
    localStorage.setItem(USERNAME_KEY, username);
  }
}

// UUIDを生成（簡易版）
function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
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
    username = `名無し`;
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

export function validateUsername(name: string) {
  const parseResult = usernameSchema.safeParse(name);
  return parseResult.success;
}

export function setUsernameSchema({name , setNameError, setUser}: {name: string, setNameError: React.Dispatch<React.SetStateAction<string>>, setUser: React.Dispatch<React.SetStateAction<string>>}) {
  setNameError('');
  const isValid = validateUsername(name);

  if (isValid) {
    setUser(name);
    setUsername(name);
  } else {
    setNameError('ユーザー名は10文字以内です。');
  }
}