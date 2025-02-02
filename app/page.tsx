"use client";

import styles from "./styles/Home.module.css";
import Image from "next/image";
import Link from "next/link";

export default function TopPage() {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <Image
          src="/images/logo.png"
          alt="Bright Balance Logo"
          width={300}
          height={300}
          className={styles.logo}
        />
        <h1 className={styles.title}>Bright Balance</h1>
        <p className={styles.tagline}>～日記で整える、心と生活～</p>
      </div>

      <div className={styles.buttons}>
        <Link href="/auth">
          <button className={styles.button}>ログイン/サインアップ</button>
        </Link>
      </div>
    </div>
  );
}
