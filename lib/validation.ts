import { z } from 'zod';

// ユーザー名バリデーション用スキーマ
export const forbiddenChars = /[<>&\/\\'"]/;

export const textSchema = z
  .string()
  .refine((val) => !forbiddenChars.test(val), {
    message: '使用できない文字が含まれています。',
  });

export function validateText(text: string) {
  const parseResult = textSchema.safeParse(text);
  return parseResult as { success: boolean; error?: z.ZodError };
}
