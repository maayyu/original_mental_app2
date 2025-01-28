"use client";

import styles from "./styles/Home.module.css";
import Image from "next/image";
import Link from "next/link";

export default function TopPage() {
  return (
    <div className={styles.container}>
      <Image
        src="/images/logo.png"
        alt="Bright Balance Logo"
        width={200}
        height={200}
        className={styles.logo}
      />
      <h1 className={styles.title}>Bright Balance</h1>
      <p className={styles.tagline}>日記で整える、心と生活</p>
      <div className={styles.buttons}>
        <Link href="/auth/sign-in">
          <button className={styles.button}>ログイン</button>
        </Link>
        <Link href="/auth/sign-up">
          <button className={styles.button}>サインアップ</button>
        </Link>
      </div>
    </div>
  );
}
