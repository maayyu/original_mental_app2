// 日記詳細ページ

"use client";

import supabase from "@/lib/supabaseClient";
import React, { useEffect, useState } from "react";
import "./datas.css";

type Diary = {
  id: string;
  title: string;
  content: string;
  created_at: string;
  converted_content: string;
};

export default function DiaryEntryPage() {
  const [diaries, setDiaries] = useState<Diary[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectDiary, setSelectDiary] = useState<Diary | null>(null);

  useEffect(() => {
    // 日記データを取得
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
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching diaries: ", error.message);
      } else {
        setDiaries(data as Diary[]);
      }
      setLoading(false);
    };
    fetchDiaries();
  }, []);

  const handleDiaryClick = (diary: Diary) => {
    setSelectDiary(diary);
  };

  const handleClose = () => {
    setSelectDiary(null);
  };

  return (
    <div className="diary-container">
      {/* 日記の詳細を表示するためのコンテンツ */}
      <h2 className="diary-title">最新の日記</h2>
      {loading ? (
        <p>読み込み中...</p>
      ) : (
        <ul className="diary-list">
          {diaries.map((diary) => (
            <li
              key={diary.id}
              onClick={() => handleDiaryClick(diary)}
              className="diary-item"
            >
              <p className="diary-date">
                {new Date(diary.created_at).toLocaleString("ja-JP", {
                  weekday: "short",
                  year: "numeric",
                  month: "numeric",
                  day: "numeric",
                  hour: "numeric",
                  minute: "numeric",
                  hour12: false,
                })}
              </p>
              <p className="diary-content">
                <strong>日記内容</strong>
                <br />
                {diary.content}
              </p>
              <p className="diary-content">
                <strong>変換後の日記内容</strong>
                <br />
                {diary.converted_content}
              </p>
            </li>
          ))}
        </ul>
      )}

      {/* 選択された日記詳細を表示する */}
      {selectDiary && (
        <div className="modal-overlay" onClick={handleClose}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-button" onClick={handleClose}>
              ×
            </button>
            <h3>日記の詳細</h3>
            <p className="diary-date">
              {new Date(selectDiary.created_at).toLocaleString("ja-JP", {
                weekday: "short",
                year: "numeric",
                month: "numeric",
                day: "numeric",
                hour: "numeric",
                minute: "numeric",
                hour12: false,
              })}
            </p>
            <p className="diary-content">
              <strong>日記内容:</strong> {selectDiary.content}
            </p>
            <p className="diary-converted">
              <strong>変換後の日記内容:</strong> {selectDiary.converted_content}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
