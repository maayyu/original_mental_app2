"use client";

import supabase from "@/lib/supabaseClient";
import { User } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import "./header.css";
import Link from "next/link";

export default function Header() {
  const [user, setUser] = useState<User | null>(null);

  const router = useRouter();

  useEffect(() => {
    // 現在の状態を確認する
    const initializeAuth = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setUser(session?.user ?? null);

      // 認証状態の変更を確認する
      const {
        data: { subscription },
      } = supabase.auth.onAuthStateChange((event, session) => {
        setUser(session?.user ?? null);
      });
      return () => subscription.unsubscribe();
    };
    initializeAuth();
  }, []);

  //   ログアウトの処理
  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      router.push("/auth/sign-in");
    } catch (error) {
      console.log("ログアウトに失敗", error);
    }
  };

  const handleHome = async () => {
    router.push("/");
  };

  return (
    <header className="header">
      <div className="header-center">
        <h1 className="app-name">アプリ名</h1>
      </div>

      <div className="header-right">
        <button className="header-home" onClick={handleHome}>
          ホーム
        </button>{" "}
        {user ? (
          <>
            <div className="user-icon">{user.email.charAt(0)}</div>{" "}
            <button className="logout-button" onClick={handleLogout}>
              {" "}
              ログアウト{" "}
            </button>
          </>
        ) : (
          <>
            <span className="guest">ゲスト</span>{" "}
            <Link href="/auth/sign-in">
              {" "}
              <button className="login-button">ログイン</button>{" "}
            </Link>
          </>
        )}
      </div>
    </header>
  );
}
