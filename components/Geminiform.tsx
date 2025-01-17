"use client";

import { useRef } from "react";

const Home = () => {
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const outputRef = useRef<HTMLTextAreaElement>(null);

  const onButtonClick = () => {
    if (inputRef.current && outputRef.current) {
      // 入力値を出力フィールドに反映
      outputRef.current.value = inputRef.current.value;
    }
  };

  return (
    <div className="App">
      <p>Input</p>
      <textarea
        id="input"
        rows={5}
        ref={inputRef}
        className="textarea"
      ></textarea>

      <p>Output</p>
      <textarea
        id="output"
        rows={5}
        readOnly
        ref={outputRef}
        className="textarea"
      ></textarea>

      <button type="button" id="button" onClick={onButtonClick}>
        send
      </button>

      <style jsx>{`
        .textarea {
          width: 100%;
          margin-bottom: 16px;
          padding: 8px;
          font-size: 16px;
        }

        button {
          background-color: #6200ee;
          color: white;
          border: none;
          padding: 8px 16px;
          cursor: pointer;
          font-size: 16px;
        }

        button:hover {
          background-color: #3700b3;
        }
      `}</style>
    </div>
  );
};

export default Home;
