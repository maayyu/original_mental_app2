// ホーム画面中央
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
        justifyContent: "space-between",
        height: "100vh",
        width: "100%",
        padding: "16px",
        boxSizing: "border-box",
      }}
    >
      {/* メインビジュアル（木の画像） */}
      <Box
        sx={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          backgroundColor: "rgba(255, 255, 255, 0.8)",
          borderRadius: "8px",
          margin: "20px",
        }}
      >
        <img
          src="/images/tree-silhouette.jpeg"
          alt="木の画像"
          style={{ maxWidth: "100%", maxHeight: "80%" }}
        />
      </Box>

      {/* 最新の日記 */}
      <Box
        sx={{
          flex: 1,
          width: "100%",
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
          <CircularProgress />
        ) : (
          <List>
            {diaries.map((diary) => (
              <React.Fragment key={diary.id}>
                <ListItem>
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
                      sx={{ marginLeft: "8px", marginTop: "8px" }}
                    >
                      <strong>日記内容:</strong> {diary.content}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ marginLeft: "8px", marginTop: "8px" }}
                    >
                      <strong>変換後の日記内容:</strong>{" "}
                      {diary.converted_content}
                    </Typography>
                  </Box>{" "}
                </ListItem>
                <Divider />
              </React.Fragment>
            ))}
          </List>
        )}{" "}
      </Box>
    </Box>
  );
}
