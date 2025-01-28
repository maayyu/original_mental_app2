// ホーム画面
"use client";

import Header from "@/components/header/Header";
import Sidebar from "@/components/sidebar/Sidebar";
import { Box } from "@mui/material";
import { usePathname } from "next/navigation";

export default function Layout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const isAuthPage =
    pathname === "/auth/sign-in" || pathname === "/auth/sign-up";

  return (
    <html>
      <body>
        {/* ヘッダーとサイドバーを非表示にする条件 */}
        {!isAuthPage && (
          <Box sx={{ display: "flex", height: "100vh" }}>
            <Header />
            <Sidebar />
            <Box
              component="main"
              sx={{
                flexGrow: 1,
                padding: "20px",
                marginLeft: "250px",
              }}
            >
              {children}
            </Box>
          </Box>
        )}

        {/* サインイン/サインアップページの場合 */}
        {isAuthPage && <Box sx={{ padding: "20px" }}>{children}</Box>}
      </body>
    </html>
  );
}
