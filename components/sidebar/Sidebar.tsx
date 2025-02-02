"use client";

import React from "react";
import { useRouter } from "next/navigation";
import "./sidebar.css";

export default function Sidebar() {
  const router = useRouter();

  // メニュー項目
  const menuItems = [
    { text: "今日の日記", path: "/diary/input" },
    { text: "ストレスチェック", path: "/stress-check" },
    { text: "日記記録", path: "/datas/${id}" },
    // { text: "使い方", path: "/how-to" },
  ];

  return (
    <nav className="sidebar">
      <h2 className="sidebarTitle">メニュー</h2>
      <ul className="menuList">
        {menuItems.map((item, index) => (
          <li key={index} className="menuItem">
            <button
              className="menuButton"
              onClick={() => router.push(item.path)}
            >
              {item.text}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
}
