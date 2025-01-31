// ストレスチェック設問のページ
"use client";

import React, { useEffect, useState } from "react";
import supabase from "@/lib/supabaseClient";
import { questionsByDay } from "@/lib/stress/questions";
import { useRouter } from "next/navigation";
import { getStressLevel } from "@/lib/stress/stressLevels";

export default function StressCheckPage() {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [answers, setAnswers] = useState(Array(7).fill(""));
  const [userId, setUserId] = useState(null);

  const router = useRouter();

  useEffect(() => {
    const fetchUserId = async () => {
      const response = await supabase.auth.getUser();
      if (response.data.user) {
        setUserId(response.data.user.id);
      }
    };
    fetchUserId();

    const dayOfWeek = new Date().getDay();
    setQuestions(questionsByDay[dayOfWeek] || []);
  }, []);

  const handleChange = (index, value) => {
    const newAnswers = [...answers];
    newAnswers[index] = value;
    setAnswers(newAnswers);
  };
  const handleSubmit = async () => {
    if (answers.includes("")) {
      alert("全ての質問に回答してください。");
      return;
    }
    setLoading(true);
    console.log("Submitting answers:", answers);

    const totalScore = answers.reduce(
      (acc, answer) => acc + parseInt(answer, 10),
      0
    );
    const percentageScore = Math.round(
      (totalScore / (questions.length * 4)) * 100
    );
    const stressLevel = getStressLevel(percentageScore);

    console.log("Total Score:", totalScore);
    console.log("Percentage Score:", percentageScore);
    console.log("Stress Level:", stressLevel);

    const { data, error } = await supabase.from("stress_checks").insert([
      {
        user_id: userId,
        answers,
        total_score: totalScore,
        percentage_score: percentageScore,
        stress_level: stressLevel,
        created_at: new Date(),
      },
    ]);

    if (error) {
      console.log(error.message);
    } else {
      const queryString = new URLSearchParams({
        totalScore: totalScore.toString(),
        percentageScore: percentageScore.toString(),
        answers: JSON.stringify(answers),
      }).toString();

      router.push(`/stress-check/stress-check-result?${queryString}`);
    }
    setLoading(false);
  };

  return (
    <div className="container">
      <h1>ストレスチェック</h1>
      {questions.map((question, index) => (
        <div key={index} className="output-box">
          <h2>{question}</h2>
          <div className="radioGroup">
            <label>
              <input
                type="radio"
                name={`question-${index}`}
                value="0"
                required
                onChange={(e) => handleChange(index, e.target.value)}
              />
              0: 全くない
            </label>
            <label>
              <input
                type="radio"
                name={`question-${index}`}
                value="1"
                required
                onChange={(e) => handleChange(index, e.target.value)}
              />
              1: ほとんどない
            </label>
            <label>
              <input
                type="radio"
                name={`question-${index}`}
                value="2"
                required
                onChange={(e) => handleChange(index, e.target.value)}
              />
              2: 時々ある
            </label>
            <label>
              <input
                type="radio"
                name={`question-${index}`}
                value="3"
                required
                onChange={(e) => handleChange(index, e.target.value)}
              />
              3: よくある
            </label>
            <label>
              <input
                type="radio"
                name={`question-${index}`}
                value="4"
                required
                onChange={(e) => handleChange(index, e.target.value)}
              />
              4: いつもある
            </label>
          </div>
        </div>
      ))}
      <div className="output-box">
        <button
          type="submit"
          disabled={loading || answers.includes("")}
          onClick={handleSubmit}
          className="button"
        >
          採点
        </button>
      </div>
    </div>
  );
}
