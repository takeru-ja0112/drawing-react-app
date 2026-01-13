# Project: Minimalist Drawer (仮)

- 回答時に必ず「🛠️」をつけてください

## 1. 概要
「少ない要素で、いかに伝えるか」を競う、戦略的ミニマルお絵描きクイズゲーム。
お題に対して、限られた図形（直線、長方形、円）だけで表現し、その「要素数の少なさ」がゲーム進行の鍵となる。

## 2. ゲームルール
- **役割**: 1人の「回答者」と、1人以上の「描き手」。
- **制限**: 描画に使用できるのは「直線・長方形・円」のみ。
- **進行**: 
  1. 全員がお題に沿って描画する。
  2. 描き終わったら、**構成要素（図形の数）が少ない順**に回答フェーズで公開される。
  3. 回答者が正解すれば、その時点の描き手と回答者にポイント付与。
  4. 外れた場合は、次の（要素数が多い）描き手の絵が追加公開される。
- **駆け引き**: 要素が少ないほど高得点のチャンスだが、伝わらなければ次の人にヒントを与えることになる。

## 3. 技術スタック
- **Frontend**: Next.js (React), Tailwind CSS
- **Backend/DB**: Supabase (PostgreSQL, Realtime functionality)
- **Canvas Library**: React-Konva (Konva.js)
- **Deployment**: Vercel

## 4. データ構造 (Supabase)

### `rooms` (部屋管理)
- `id` (uuid, PK)
- `status` (text): 'WAITING' | 'DRAWING' | 'ANSWERING' | 'RESULT'
- `current_theme` (text): 現在のお題
- `answerer_id` (uuid): 回答者のID

### `drawings` (描画データ)
- `id` (uuid, PK)
- `room_id` (uuid, FK)
- `user_id` (uuid)
- `canvas_data` (jsonb): 図形の座標、種類、色の配列
- `element_count` (int): 使用した図形の総数

## 5. 画面構成とステータス
1. **Lobby (`WAITING`)**: 参加者待機、ルームID共有。
2. **Canvas (`DRAWING`)**: 描き手がお題を描画。要素数をリアルタイムカウント。
3. **Quiz (`ANSWERING`)**: 要素数昇順で1人ずつ描画データをCanvasに再現。回答者が入力。
4. **Result (`RESULT`)**: スコア表示。

## 6. 実装の優先順位 (MVP)
1. **Canvas Core**: React-Konvaによる図形描画（直線・矩形・円）と要素数カウント機能。
2. **State Management**: Supabase Realtimeを用いたステータス遷移の同期。
3. **Logic**: 要素数によるソート表示と回答判定。