"use client";

import { useState } from "react";
import { getPositiveThoughts } from "../utils/api";

export default function PositiveConverter() {
  const [inputText, setInputText] = useState("");
  const [outputText, setOutputText] = useState("");
  const [loading, setLoading] = useState(false);

  const handleConvert = async () => {
    if (!inputText) return;
    setLoading(true);
    try {
      const result = await getPositiveThoughts(inputText);
      setOutputText(result);
    } catch (error) {
      setOutputText("エラーが発生しました。もう一度お試しください。");
    }
    setLoading(false);
  };

  return (
    <div>
      <h1>ポジティブ変換アプリ</h1>
      <textarea
        placeholder="日記や考えを書いてください..."
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
      />
      <button onClick={handleConvert} disabled={loading}>
        {loading ? "変換中..." : "ポジティブ変換"}
      </button>
      {outputText && (
        <div>
          <h2>変換結果:</h2>
          <p>{outputText}</p>
        </div>
      )}
    </div>
  );
}
