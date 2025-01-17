import React from "react";
import Link from "next/link";
import { Button, Typography } from "@mui/material";

export default function Sidebar() {
  return (
    <>
      <Typography>機能一覧</Typography>

      <Link href="/app/diary/page.tsx">
        <Button>今日の一言</Button>
      </Link>
    </>
  );
}
