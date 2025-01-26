// ホーム画面
"use client";

import Header from "@/components/header/Header";
import Sidebar from "@/components/sidebar/Sidebar";
import { Box } from "@mui/material";
import { usePathname } from "next/navigation";

export default function Layout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // サインイン、サインアップにヘッダーとサイドバーを非表示に（トップページも）
  const isAuthPage =
    pathname === "/auth/sign-in" ||
    pathname === "/auth/sign-up" ||
    pathname === "/";

  return (
    <html>
      <body>
        {/* ヘッダーとサイドバーを非表示にする条件 */}
        {!isAuthPage && (
          <>
            <Header />
            <Sidebar />
            <Box
              component="main"
              sx={{
                flexGrow: 1,
                padding: "20px",
                marginLeft: "250px",
                marginTop: "100px",
              }}
            >
              {children}
            </Box>
          </>
        )}

        {/* サインイン/サインアップページの場合 */}
        {isAuthPage && <Box sx={{ padding: "20px" }}>{children}</Box>}
      </body>
    </html>
  );
}
