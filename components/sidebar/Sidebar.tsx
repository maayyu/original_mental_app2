"use client";

import React from "react";
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Toolbar,
  Typography,
} from "@mui/material";
import { useRouter } from "next/navigation";

export default function Sidebar() {
  const router = useRouter();

  // メニュー項目
  const menuItems = [
    { text: "今日の日記", path: "/diary/input" },
    { text: "ストレスチェック", path: "/stress-check" },
    { text: "日記記録", path: "/datas/${id}" },
    { text: "使い方", path: "/how-to" },
  ];

  return (
    <Drawer variant="permanent">
      <Toolbar>
        <Typography variant="h6" noWrap component="div">
          メニュー
        </Typography>
      </Toolbar>
      <List>
        {menuItems.map((item, index) => (
          <ListItem key={index} disablePadding>
            <ListItemButton onClick={() => router.push(item.path)}>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
}
