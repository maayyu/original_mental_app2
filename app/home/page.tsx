"use client";

import React, { useEffect, useState } from "react";
import supabase from "@/lib/supabaseClient";
import "./home.css";
import PixijsForm from "@/components/PixijsForm";

type Diary = {
  id: string;
  title: string;
  content: string;
  created_at: string;
  converted_content: string;
};

export default function HomePage() {
  const [diaries, setDiaries] = useState<Diary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 最新3日分の日記データを取得
    const fetchDiaries = async () => {
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

      // ログインユーザーのデータのみ取得
      const { data, error } = await supabase
        .from("diaries")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(3);

      if (error) {
        console.error("Error fetching diaries: ", error.message);
      } else {
        setDiaries(data as Diary[]);
      }
      setLoading(false);
    };
    fetchDiaries();
  }, []);

  return (
    <div className="container">
      {/* メインビジュアル */}
      <div className="visual">
        <PixijsForm />
      </div>

      {/* 最新の日記 */}
      <div className="diaryContainer">
        <h2>最新の日記</h2>
        {loading ? (
          <div className="loading">Loading...</div>
        ) : diaries.length === 0 ? (
          <p className="noDiary">現在、保存されている日記がありません。</p>
        ) : (
          <ul className="diaryList">
            {diaries.map((diary) => (
              <React.Fragment key={diary.id}>
                <li className="diaryItem">
                  <p className="diaryDate">
                    {new Date(diary.created_at).toLocaleString("ja-JP", {
                      year: "numeric",
                      month: "numeric",
                      day: "numeric",
                      weekday: "short",
                      hour: "numeric",
                      minute: "numeric",
                      hour12: false,
                    })}
                  </p>
                  <p className="diaryContent">
                    <strong>日記内容</strong>
                    <br />
                    {diary.content}
                  </p>
                  <p className="diaryContent">
                    <strong>変換後の日記内容</strong> <br />
                    {diary.converted_content}
                  </p>
                </li>
                <hr />
              </React.Fragment>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
