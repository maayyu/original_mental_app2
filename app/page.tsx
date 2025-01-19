// ホーム画面

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
