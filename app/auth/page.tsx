// 認証機能
"use client";

import { useState } from "react";
import supabase from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import bcrypt from "bcryptjs";
import { Alert, TextField } from "@mui/material";
import "./auth.css";

export default function AuthPage() {
  const [isSignUp, setIsSignUp] = useState(true);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setMessage(null);
    setLoading(true);

    if (!email) {
      setError("メールアドレスが入力されていません");
      return;
    }
    if (!password) {
      setError("パスワードが入力されていません");
      return;
    }

    setLoading(true);

    if (isSignUp) {
      // サインアップ処理
      const { data: existingUser, error: emailCheckError } = await supabase
        .from("users")
        .select("email")
        .eq("email", email);

      if (emailCheckError) {
        console.error("Email Check Error: ", emailCheckError.message);
        setError("ユーザー情報の確認中にエラーが発生しました。");
        setLoading(false);
        return;
      }

      if (existingUser.length > 0) {
        setError("このメールアドレスはすでに登録されています。");
        setLoading(false);
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
          setLoading(false);
          return;
        }

        // 登録出来たら、メールを確認メッセージを表示
        setMessage("確認メールを送信しました。メールをご確認ください");
        setError(null);

        setTimeout(() => router.push("/auth/sign-in"), 3000);
      }
    } else {
      // サインイン処理
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setError("ユーザー名またはパスワードが間違っています。");
        setLoading(false);
        return;
      }

      setLoading(false);

      // ユーザー情報を取得
      const { data: user, error: userError } = await supabase
        .from("users")
        .select("*")
        .eq("email", email)
        .single();

      if (userError) {
        console.error("ユーザー情報の取得に失敗しました:", userError);
        setError("エラーが発生しました。もう一度お試しください。");
        return;
      }

      // ユーザー情報が存在しない場合、usersテーブルに保存
      if (!user) {
        // パスワードをハッシュ化
        const hashedPassword = await bcrypt.hash(password, 10);

        const { error: insertError } = await supabase.from("users").insert([
          {
            id: data.user.id,
            name: email.split("@")[0], // emailからユーザー名を生成 (必要に応じて変更)
            email,
            password: hashedPassword,
            email_verified: false,
          },
        ]);

        if (insertError) {
          console.error("ユーザー情報の保存に失敗しました:", insertError);
          setError("エラーが発生しました。もう一度お試しください。");
          return;
        }
      }

      router.push("/home");
    }
  };

  return (
    <div className="container">
      <div className="auth-box">
        <h1 className="auth-title">
          {isSignUp ? "アカウント作成" : "ログイン"}
        </h1>
        <form onSubmit={handleAuth} className="auth-form">
          {isSignUp && (
            <TextField
              label="ユーザー名"
              variant="outlined"
              margin="normal"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="auth-input"
            />
          )}
          <TextField
            label="メールアドレス"
            variant="outlined"
            margin="normal"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="auth-input"
          />
          <TextField
            label="パスワード"
            variant="outlined"
            margin="normal"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="auth-input"
          />
          {error && (
            <Alert severity="error" className="alert">
              {error}
            </Alert>
          )}
          {message && (
            <Alert severity="success" className="alert">
              {message}
            </Alert>
          )}
          <button type="submit" className="auth-button">
            {loading ? "処理中..." : isSignUp ? "登録する" : "ログイン"}
          </button>
        </form>
        <div className="signin-container">
          <span className="signin-text">
            {isSignUp
              ? "すでにアカウントをお持ちですか？"
              : "アカウントをお持ちでない方は"}{" "}
          </span>
          <button
            onClick={() => setIsSignUp(!isSignUp)}
            className="signin-link"
          >
            {isSignUp ? "ログイン" : "登録へ"}
          </button>
        </div>
      </div>
    </div>
  );
}
