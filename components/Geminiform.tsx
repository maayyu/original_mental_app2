"use client";

import { useRef, useState } from "react";
import { geminiRun } from "../lib/geminiClient";

const GeminiForm = () => {
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const outputRef = useRef<HTMLTextAreaElement>(null);
  const [loading, setLoading] = useState(false);

  const onButtonClick = async () => {
    if (inputRef.current && outputRef.current) {
      const inputText = inputRef.current.value;
      // 入力値を出力フィールドに反映
      if (inputText.trim() === "") {
        outputRef.current.value = "テキストを入力してください";
        return;
      }
      setLoading(true);
      try {
        const transformedText = await geminiRun(inputText);
        outputRef.current.value = transformedText;
      } catch (error) {
        console.log("Error while processing:", error);
        outputRef.current.value =
          "変換に失敗しました、もう一度入力してください";
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="App">
      <p>今日のInput</p>
      <textarea
        id="input"
        rows={5}
        ref={inputRef}
        className="textarea"
      ></textarea>

      <p>言い換えOutput</p>
      <textarea
        id="output"
        rows={5}
        readOnly
        ref={outputRef}
        className="textarea"
      ></textarea>

      <button
        type="button"
        id="button"
        onClick={onButtonClick}
        disabled={loading}
      >
        {loading ? "変換中..." : "送信"}
      </button>

      <style jsx>{`
        .textarea {
          width: 100%;
          margin-bottom: 16px;
          padding: 8px;
          font-size: 16px;
        }

        button {
          background-color: ${loading ? "#cccccc" : "#6200ee"};
          color: white;
          border: none;
          padding: 8px 16px;
          cursor: ${loading ? "not-allowed" : "pointer"};
          font-size: 16px;
        }

        button:hover {
          background-color: ${loading ? "#cccccc" : "#3700b3"};
        }
      `}</style>
    </div>
  );
};

export default GeminiForm;
