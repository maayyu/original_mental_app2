"use client";
// ストレスチェック結果表示のページ
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getStressLevel } from "@/lib/stress/stressLevels";
import "./stressResult.css";

export default function StressCheckResultPage() {
  const router = useRouter();
  const [totalScore, setTotalScore] = useState(0);
  const [percentageScore, setPercentageScore] = useState(0);
  const [parsedAnswers, setParsedAnswers] = useState([]);

  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    const score = query.get("totalScore");
    const percentage = query.get("percentageScore");
    const answers = query.get("answers");

    setTotalScore(Number(score));
    setPercentageScore(Number(percentage));
    setParsedAnswers(answers ? JSON.parse(answers) : []);
  }, []);

  const handleHome = async () => {
    router.push("/home");
  };

  return (
    <div className="container">
      <h1>ストレスチェック結果</h1>
      <p>合計スコア: {totalScore}</p>
      <p>ストレス度: {percentageScore}%</p>
      <h2>ストレスレベル:{getStressLevel(percentageScore)} </h2>
      <ul>
        {parsedAnswers.map((answer, index) => (
          <li key={index}>
            質問 {index + 1}: {answer}
          </li>
        ))}
      </ul>
      <button onClick={handleHome} className="button">
        ホーム画面へ
      </button>
    </div>
  );
}
