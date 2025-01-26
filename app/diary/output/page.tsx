"use client";

import { useEffect, useState } from "react";
import { geminiRun } from "@/lib/geminiClient";
import supabase from "@/lib/supabaseClient";

export default function DiaryOutputPage() {
  const [data, setData] = useState<{
    content: string;
    converted_content: string;
  } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      // 認証ユーザー情報の取得
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError || !user) {
        alert("認証エラー: ログインしてください。");
        setLoading(false);
        return;
      }

      //   最新の入力内容の取得
      const { data: diary, error: fetchError } = await supabase
        .from("diaries")
        .select("content, converted_content")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(1)
        .single();

      if (fetchError) {
        alert("データの取得に失敗しました。");
        setLoading(false);
        return;
      }

      //   未変換の場合は、変換させる
      if (!diary.converted_content) {
        const convertedContent = await geminiRun(diary.content);

        // 変換した内容をデータベースに保存
        await supabase
          .from("diaries")
          .update({ converted_content: convertedContent })
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })
          .limit(1);

        setData({
          content: diary.content,
          converted_content: convertedContent,
        });
      } else {
        setData(diary);
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  if (loading) {
    return <p>読み込み中...</p>;
  }

  return (
    <div className="container">
      <h1>出力結果</h1>
      <div className="output-box">
        <h2>入力内容</h2>
        <p>{data?.content}</p>
      </div>
      <div className="output-box">
        <h2>ポジティブ変換結果</h2>
        <p>{data?.converted_content}</p>
      </div>
    </div>
  );
}
