-- Row Level Security (RLS) を一時的に無効化（開発用）
-- 本番環境では適切なポリシーを設定してください

ALTER TABLE rooms DISABLE ROW LEVEL SECURITY;
ALTER TABLE drawings DISABLE ROW LEVEL SECURITY;

-- または、全員がアクセスできるポリシーを設定する場合:
-- ALTER TABLE rooms ENABLE ROW LEVEL SECURITY;
-- CREATE POLICY "Enable all access for rooms" ON rooms FOR ALL USING (true);

-- ALTER TABLE drawings ENABLE ROW LEVEL SECURITY;
-- CREATE POLICY "Enable all access for drawings" ON drawings FOR ALL USING (true);
