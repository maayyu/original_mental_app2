"use client";

import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  List,
  ListItem,
  Divider,
  CircularProgress,
} from "@mui/material";
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
    // 最新5日分の日記データを取得
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
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "30px",
        width: "100%",
        height: "100vh",
        boxSizing: "border-box",
      }}
    >
      {/* メインビジュアル（木の画像） */}
      <Box
        sx={{
          flex: 1,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
          borderRadius: "13px",
          marginBottom: "20px",
          padding: "10px",
          marginTop: "180px",
        }}
      >
        <PixijsForm />
      </Box>

      {/* 最新の日記 */}
      <Box
        sx={{
          width: "100%",
          maxWidth: "900px",
          backgroundColor: "rgba(255, 255, 255, 0.8)",
          borderRadius: "8px",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
          padding: "16px",
          boxSizing: "border-box",
        }}
      >
        <Typography variant="h6" gutterBottom>
          最新の日記
        </Typography>
        {loading ? (
          <CircularProgress sx={{ display: "block", margin: "0 auto" }} />
        ) : diaries.length === 0 ? (
          <Typography variant="body1" sx={{ textAlign: "center" }}>
            現在、保存されている日記がありません。
          </Typography>
        ) : (
          <List>
            {diaries.map((diary) => (
              <React.Fragment key={diary.id}>
                <ListItem sx={{ paddingLeft: 0, paddingRight: 0 }}>
                  <Box sx={{ width: "100%" }}>
                    <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                      {new Date(diary.created_at).toLocaleString("ja-JP", {
                        weekday: "short",
                        year: "numeric",
                        month: "numeric",
                        day: "numeric",
                        hour: "numeric",
                        minute: "numeric",
                        hour12: false,
                      })}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ marginTop: "8px", wordBreak: "break-word" }}
                    >
                      <strong>日記内容:</strong> {diary.content}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ marginTop: "8px", wordBreak: "break-word" }}
                    >
                      <strong>変換後の日記内容:</strong>{" "}
                      {diary.converted_content}
                    </Typography>
                  </Box>
                </ListItem>
                <Divider />
              </React.Fragment>
            ))}
          </List>
        )}
      </Box>
    </Box>
  );
}
