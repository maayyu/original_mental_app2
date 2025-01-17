"use client";

import { createClient } from "@supabase/supabase-js";

// 環境変数からSupabaseのURLとAPIキーを取得
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Supabaseクライアントの作成
const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;