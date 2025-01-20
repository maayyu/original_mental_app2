"use client";

import { createClient } from "@supabase/supabase-js";

// 環境変数からSupabaseのURLとAPIキーを取得
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Supabaseクライアントの作成
const supabase = createClient(supabaseUrl, supabaseKey);

// console.log("Supabase URL:", process.env.NEXT_PUBLIC_SUPABASE_URL);
// console.log("Supabase Key:", process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

export default supabase;