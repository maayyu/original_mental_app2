"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import "./sidebar.css";

export default function Sidebar() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  // メニュー項目
  const menuItems = [
    { text: "今日の日記", path: "/diary/input" },
    { text: "ストレスチェック", path: "/stress-check" },
    { text: "日記記録", path: "/datas/${id}" },
    // { text: "使い方", path: "/how-to" },
  ];

  return (
    <>
      {/* ハンバーガーメニュー */}
      <button className="hamburger" onClick={() => setIsOpen(!isOpen)}>
        ☰
      </button>

      {isOpen && (
        <div className="overlay" onClick={() => setIsOpen(false)}></div>
      )}

      <nav className={`sidebar ${isOpen ? "open" : ""}`}>
        <h2 className="sidebarTitle">メニュー</h2>
        <ul className="menuList">
          {menuItems.map((item, index) => (
            <li key={index} className="menuItem">
              <button
                className="menuButton"
                onClick={() => {
                  router.push(item.path);
                  setIsOpen(false);
                }}
              >
                {item.text}
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </>
  );
}
