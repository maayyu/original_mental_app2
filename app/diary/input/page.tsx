"use client";

import supabase from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import React, { useRef, useState } from "react";
import "./input.css";

export default function DiaryInputPage() {
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async () => {
    if (inputRef.current) {
      const inputText = inputRef.current.value.trim();
      if (inputText === "") {
        alert("テキストを入力してください");
        return;
      }
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

      //Supabaseに入力内容を保存
      const { data, error } = await supabase.from("diaries").insert([
        {
          user_id: user.id,
          content: inputText,
        },
      ]);
      if (error) {
        console.error("Supabase Insert Error:", error.message, error.details);
        alert("データの保存に失敗しました");
        setLoading(false);
        return;
      }

      if (data) {
        console.log("Data saved successfully:", data);
      }

      //   保存できたら、出力画面へ
      router.push("/diary/output");
    }
  };

  return (
    <div className="App">
      <p>今日のInput</p>
      <textarea
        placeholder="今日のInputを入力してください..."
        rows={5}
        ref={inputRef}
        className="textarea"
      ></textarea>

      <button onClick={handleSubmit} disabled={loading} className="button">
        {loading ? "送信中．．．" : "送信"}
      </button>
    </div>
  );
}
