// 日記記録ページ

"use client";

import supabase from "@/lib/supabaseClient";
import {
  Box,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  List,
  ListItemText,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";

export default function DiaryEntryPage() {
  const [diaries, setDiaries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectDiary, setSelectDiary] = useState(null);

  useEffect(() => {
    // 日記データを取得
    const fetchDiaries = async () => {
      const { data, error } = await supabase
        .from("diaries")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching diaries: ", error.message);
      } else {
        setDiaries(data);
      }
      setLoading(false);
    };
    fetchDiaries();
  }, []);

  const handleDiaryClick = (diary) => {
    setSelectDiary(diary);
  };

  const handleClose = () => {
    setSelectDiary(null);
  };

  return (
    <div>
      {/* 日記の詳細を表示するためのコンテンツ */}
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
                <ListItemText
                  sx={{ paddingLeft: 0, paddingRight: 0, cursor: "pointer" }}
                  onClick={() => handleDiaryClick(diary)}
                >
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
                </ListItemText>
              </React.Fragment>
            ))}
          </List>
        )}
      </Box>

      {/* 選択された日記詳細を表示する */}
      <Dialog open={Boolean(selectDiary)} onClose={handleClose}>
        <DialogTitle>日記の詳細</DialogTitle>
        <DialogContent>
          {selectDiary && (
            <Box>
              <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                {" "}
                {new Date(selectDiary.created_at).toLocaleString("ja-JP", {
                  weekday: "short",
                  year: "numeric",
                  month: "numeric",
                  day: "numeric",
                  hour: "numeric",
                  minute: "numeric",
                  hour12: false,
                })}{" "}
              </Typography>{" "}
              <Typography
                variant="body2"
                sx={{ marginTop: "8px", wordBreak: "break-word" }}
              >
                {" "}
                <strong>日記内容:</strong> {selectDiary.content}{" "}
              </Typography>{" "}
              <Typography
                variant="body2"
                sx={{ marginTop: "8px", wordBreak: "break-word" }}
              >
                {" "}
                <strong>変換後の日記内容:</strong>{" "}
                {selectDiary.converted_content}{" "}
              </Typography>
            </Box>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
