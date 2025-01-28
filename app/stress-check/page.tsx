// ストレスチェック設問のページ
"use client";

import {
  Box,
  Button,
  Container,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  Typography,
} from "@mui/material";
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
    <Container>
      <Typography>ストレスチェック</Typography>

      <Box
        component="form"
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
      >
        {questions.map((question, index) => (
          <FormControl
            component="fieldset"
            key={index}
            fullWidth
            sx={{ marginBottom: 2 }}
          >
            <Typography>{question} </Typography>
            <RadioGroup onChange={(e) => handleChange(index, e.target.value)}>
              <FormControlLabel
                value="0"
                control={<Radio />}
                label="0: 全くない"
              />
              <FormControlLabel
                value="1"
                control={<Radio />}
                label="1: ほとんどない"
              />
              <FormControlLabel
                value="2"
                control={<Radio />}
                label="2: 時々ある"
              />
              <FormControlLabel
                value="3"
                control={<Radio />}
                label="3: よくある"
              />
              <FormControlLabel
                value="4"
                control={<Radio />}
                label="4: いつもある"
              />
            </RadioGroup>
          </FormControl>
        ))}
        <Button
          variant="contained"
          color="primary"
          type="submit"
          disabled={loading || answers.includes("")}
        >
          採点
        </Button>
      </Box>
    </Container>
  );
}
