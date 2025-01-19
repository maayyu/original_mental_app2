// ホーム画面
"use client";

import Header from "@/components/header/Header";
import Sidebar from "@/components/sidebar/Sidebar";
import { Box } from "@mui/material";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <body>
        <Box sx={{ display: "flex", height: "100vh" }}>
          <Header />
          <Sidebar />
          <Box
            component="main"
            sx={{ flexGrow: 1, padding: "20px" }} // メインコンテンツの余白を設定
          >
            {children}
          </Box>
        </Box>
      </body>
    </html>
  );
}
