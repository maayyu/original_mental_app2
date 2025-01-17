// サインアップページ
"use client";

import { useState } from "react";
import supabase from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import {
  Alert,
  Box,
  Button,
  Container,
  TextField,
  Typography,
} from "@mui/material";
import "../sign-up/signup.css";

export default function SignUpPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const router = useRouter();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();

    // Supabaseのサインアップ機能
    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

    // エラーの場合、メッセージを表示
    if (error) {
      setError(error.message);
    } else {
      // 登録出来たら、メールを確認メッセージを表示
      setMessage("確認メールを送信しました。メールをご確認ください。");
      setError(null);

      setTimeout(() => router.push("/auth/sign-in"), 2000);
    }
  };

  return (
    <Container maxWidth="sm" className="container">
      <Box>
        <Typography>アカウント作成</Typography>

        <Box component="form" onSubmit={handleSignUp}>
          <TextField
            label="メールアドレス"
            variant="outlined"
            type="email"
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            label="パスワード"
            variant="outlined"
            type="password"
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {error && <Alert severity="error">{error}</Alert>}
          {message && <Alert severity="success">{message}</Alert>}

          <Button type="submit" variant="contained" color="primary">
            Sign Up
          </Button>
        </Box>
      </Box>
    </Container>
  );
}
