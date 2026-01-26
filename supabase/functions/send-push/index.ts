// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs

import { serve } from "std/server";
import { createClient } from "@supabase/supabase-js";
import webpush from "web-push";

// 環境変数の取得
const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const VAPID_PUBLIC_KEY = Deno.env.get("VAPID_PUBLIC_KEY")!;
const VAPID_PRIVATE_KEY = Deno.env.get("VAPID_PRIVATE_KEY")!;

// Supabaseクライアント初期化
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

// web-push初期化
webpush.setVapidDetails(
  "mailto:your-email@example.com",
  VAPID_PUBLIC_KEY,
  VAPID_PRIVATE_KEY
);

serve(async (req : any) => {
  // リクエストボディからタイトル・本文取得
  const { title, body } = await req.json();

  // DBからサブスクリプション情報取得
  const { data, error } = await supabase.from("subscriptions").select("*");
  if (error) {
    return new Response(JSON.stringify({ success: false, error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }

  // 各サブスクリプションに通知送信
  let successCount = 0;
  for (const sub of data ?? []) {
    try {
      await webpush.sendNotification(sub.subscription, JSON.stringify({ title, body }));
      successCount++;
    } catch (e) {
      console.error("送信エラー:", e);
    }
  }

  return new Response(JSON.stringify({ success: true, sent: successCount }), {
    headers: { "Content-Type": "application/json" },
  });
});

/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/send-push' \
    --header 'Authorization: Bearer eyJhbGciOiJFUzI1NiIsImtpZCI6ImI4MTI2OWYxLTIxZDgtNGYyZS1iNzE5LWMyMjQwYTg0MGQ5MCIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjIwODQ3NjM4NTh9.6ToQsfS8rw6dVUOyrYtBMTh3r-S4U62Umt4kFQEQ2vAdp_Xvefw-kant4QRp5BEkjJ_BsUlBIjTFrgc-daQYXw' \
    --header 'Content-Type: application/json' \
    --data '{"name":"Functions"}'

*/
