// ホーム画面
"use client";

import HomeMain from "./home/page";
import Header from "@/components/header/Header";
import Sidebar from "@/components/sidebar/Sidebar";

export default function Home() {
  return (
    <>
      <Header />
      <Sidebar />
      <HomeMain />
    </>
  );
}
