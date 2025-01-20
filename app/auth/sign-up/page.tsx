// サインアップページ
"use client";

import { useState } from "react";
import supabase from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import bcrypt from "bcryptjs";
import { Alert, TextField } from "@mui/material";
import "../sign-up/signup.css";
import Link from "next/link";

export default function SignUpPage() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const router = useRouter();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setMessage(null);

    if (!email) {
      setError("メールアドレスが入力されていません");
      return;
    }
    if (!password) {
      setError("パスワードが入力されていません");
      return;
    }
    if (!username) {
      setError("ユーザー名が入力されていません");
      return;
    }

    // メールアドレスがすでに登録されているかを確認
    const { data: existingUser, error: emailCheckError } = await supabase
      .from("users")
      .select("email")
      .eq("email", email);

    if (emailCheckError) {
      console.error("Email Check Error: ", emailCheckError.message);
      setError("ユーザー情報の確認中にエラーが発生しました。");
      return;
    }

    if (existingUser.length > 0) {
      setError("このメールアドレスはすでに登録されています。");
      return;
    }

    // Supabaseのサインアップ機能
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
        data: {
          name: username,
        },
      },
    });

    // エラーの場合、メッセージを表示
    if (error) {
      if (error.message.includes("Invalid email")) {
        setError("メールアドレスの形式が正しくありません。");
      } else if (error.message.includes("Password should be at least")) {
        setError("パスワードは少なくとも6文字以上で入力してください。");
      } else {
        setError("エラーが発生しました。もう一度お試しください。");
      }
      return;
    }

    // パスワードをハッシュ化
    const hashedPassword = await bcrypt.hash(password, 10);

    // 成功したらSupabaseのusersテーブルに保存
    if (data.user) {
      const { error: usersError } = await supabase.from("users").insert([
        {
          id: data.user.id,
          name: username,
          email,
          password: hashedPassword,
          email_verified: false,
        },
      ]);
      console.log(data.user);

      if (usersError) {
        console.error(usersError.message);
        await supabase.auth.admin.deleteUser(data.user.id);
        setError("ユーザー情報の保存に失敗しました。もう一度お試しください");
        return;
      }

      // 登録出来たら、メールを確認メッセージを表示
      setMessage("確認メールを送信しました。メールをご確認ください");
      setError(null);

      setTimeout(() => router.push("/auth/sign-in"), 3000);
    }
  };

  return (
    <div className="container">
      <div className="signup-box">
        <h1 className="signup-title">アカウント作成</h1>

        <form onSubmit={handleSignUp} className="signup-form">
          <TextField
            label="ユーザー名"
            variant="outlined"
            margin="normal"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="signup-input"
          />
          <TextField
            label="メールアドレス"
            variant="outlined"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="signup-input"
          />
          <TextField
            label="パスワード"
            variant="outlined"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="signup-input"
          />

          {error && (
            <Alert severity="error" className="alert error">
              {error}
            </Alert>
          )}
          {message && (
            <Alert severity="success" className="alert success">
              {message}
            </Alert>
          )}

          <button type="submit" className="signup-button">
            登録する
          </button>
        </form>

        {/* 登録済の場合はサインイン画面へ */}
        <div className="signin-container">
          <span className="signin-text">または</span>
          <Link href="/auth/sign-in" className="signin-link">
            ログイン
          </Link>
        </div>
      </div>
    </div>
  );
}
