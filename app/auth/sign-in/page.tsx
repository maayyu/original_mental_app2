// サインインページ
"use client";

import supabase from "@/lib/supabaseClient";
import {
  Alert,
  Box,
  Button,
  Container,
  TextField,
  Typography,
} from "@mui/material";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();

    // Supabaseサインインの機能
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    // エラーの表示
    if (error) {
      setError("メールアドレスまたはパスワードが間違っています");
    } else {
      setError(null);

      router.push("/");
    }
  };

  return (
    <Container maxWidth="sm" className="container">
      <Box>
        <Typography>サインイン</Typography>

        <Box component="form" onSubmit={handleSignIn}>
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

          <Button type="submit" variant="contained" color="primary">
            Sign In
          </Button>
        </Box>
        <Typography
          variant="body2"
          textAlign="center"
          marginTop={2}
          color="text.secondary"
        >
          アカウントをお持ちでない方は{" "}
          <Button
            variant="text"
            color="primary"
            onClick={() => router.push("/auth/sign-up")}
          >
            Sign Up
          </Button>
        </Typography>
      </Box>
    </Container>
  );
}
