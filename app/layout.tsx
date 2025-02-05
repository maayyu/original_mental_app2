// ホーム画面
"use client";

import Header from "@/components/header/Header";
import Sidebar from "@/components/sidebar/Sidebar";
import { usePathname } from "next/navigation";
import "@/app/globals.css";

export default function Layout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // サインイン、サインアップにヘッダーとサイドバーを非表示に（トップページも）
  const isAuthPage = pathname === "/auth" || pathname === "/";

  return (
    <html lang="ja">
      <body>
        {/* <ControlViewport /> */}
        {/* ヘッダーとサイドバーを非表示にする条件 */}
        {!isAuthPage && (
          <>
            <Header />
            <Sidebar />
            <main className="container">{children}</main>
          </>
        )}

        {/* サインイン/サインアップページの場合 */}
        {isAuthPage && <main>{children}</main>}
      </body>
    </html>
  );
}
