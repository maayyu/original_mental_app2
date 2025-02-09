import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY!);

export async function geminiRun(input: string) {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const prompt = `以下の文章を、ポジティブな視点で変換してください。
    
    条件：
    - 必ず日本語で1つの文章のみ返してください
    - 複数の選択肢は提示しないでください
    - 短い文章で返してください
    - 入力された内容を出来るだけ活用してください
    - ローマ字や英語を含めないでください
    - 元の状況を踏まえつつ、前向きな解釈を提案してください
    - 多少のアドバイスを付け加えてください:\n\n"${input}"`;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  const text = response.text();

  return text;
}
