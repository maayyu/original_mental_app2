"use client";

import supabase from "@/lib/supabaseClient";
import { User } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import "./header.css";
import Link from "next/link";
import Image from "next/image";

export default function Header() {
  const [user, setUser] = useState<User | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);

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
      router.push("/auth");
    } catch (error) {
      console.log("ログアウトに失敗", error);
    }
  };

  const handleHome = async () => {
    router.push("/home");
  };

  return (
    <header className="header">
      <div className="header-left">
        <Image
          src="/images/logo.png"
          alt="Bright Balance Logo"
          width={50}
          height={50}
          className="header-log"
        />
        <Link href="/home">
          <h1 className="app-name">Bright Balance</h1>
        </Link>
      </div>
      <div className="header-right">
        {user ? (
          <div className="user-menu">
            <div className="user-icon" onClick={() => setMenuOpen(!menuOpen)}>
              {user.email?.charAt(0)}
            </div>
            {menuOpen && (
              <div className="dropdown-menu">
                <button className="menu-button" onClick={handleHome}>
                  ホーム
                </button>
                <button className="menu-button" onClick={handleLogout}>
                  ログアウト
                </button>
              </div>
            )}
          </div>
        ) : (
          <Link href="/auth">
            <button className="login-button">ログイン</button>
          </Link>
        )}
      </div>{" "}
    </header>
  );
}
