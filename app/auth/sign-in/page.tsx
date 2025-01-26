// サインインページ
"use client";

import supabase from "@/lib/supabaseClient";
import { Alert, Button, TextField, Typography } from "@mui/material";
import { useRouter } from "next/navigation";
import { useState } from "react";
import "./signin.css";

export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setMessage(null);

    if (!email) {
      setError("ユーザー名が入力されていません");
      return;
    }
    if (!password) {
      setError("パスワードが入力されていません");
      return;
    }

    // Supabaseでサインイン処理
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setLoading(false);
      setError("ユーザー名またはパスワードが間違っています。");
      return;
    }

    if (!data) {
      setLoading(false);
      setError("ユーザー名またはパスワードが間違っています。");
      return;
    }
    console.log(message);

    // サインイン成功したらホーム画面へ遷移
    setLoading(false);
    router.push("/home");
  };

  return (
    <div className="container">
      <div className="signin-box">
        <h1 className="signin-title">サインイン</h1>

        <form onSubmit={handleSignIn} className="signin-form">
          <TextField
            label="メールアドレス"
            variant="outlined"
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="signup-input"
            fullWidth
          />
          <TextField
            label="パスワード"
            variant="outlined"
            type="password"
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="signin-input"
          />

          {error && (
            <Alert severity="error" className="alert error">
              {error}
            </Alert>
          )}

          <button type="submit" className="signin-button">
            {loading ? "処理中..." : "ログイン"}
          </button>
        </form>
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
            アカウント作成へ
          </Button>
        </Typography>
      </div>
    </div>
  );
}
