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

export default function HomePage() {
  const [diaries, setDiaries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 最新5日分の日記データを取得
    const fetchDiaries = async () => {
      const { data, error } = await supabase
        .from("diaries")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(5);

      if (error) {
        console.error("Error fetching diaries: ", error.message);
      } else {
        setDiaries(data);
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
        justifyContent: "center", // 中央に配置
        padding: "30px",
        width: "100%",
        height: "100vh",
        boxSizing: "border-box",
        backgroundColor: "#f5f5f5", // 背景色を追加
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
          backgroundColor: "rgba(255, 255, 255, 0.8)",
          borderRadius: "8px",
          marginBottom: "20px", // 下に余白を追加
          padding: "10px",
        }}
      >
        <img
          src="/images/tree-silhouette.jpeg"
          alt="木の画像"
          style={{ maxWidth: "100%", maxHeight: "80%", borderRadius: "8px" }}
        />
      </Box>

      {/* 最新の日記 */}
      <Box
        sx={{
          width: "100%",
          maxWidth: "900px", // 最大幅を設定
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
