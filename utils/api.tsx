import { HfInference } from "@huggingface/inference";

// 環境変数キー（.evn.local）の設定
const API_KEY = process.env.NEXT_PUBLIC_HUGGING_FACE_API_KEY;

// Huggingクライアントの初期化
const hf = new HfInference(API_KEY);

export const getPositiveThoughts = async (text: string): Promise<string> => {
  try {
    const result = await hf.textGeneration({
      model: "rinna/japanese-gpt2-medium", // 使用するモデル指定
      inputs: `"${text}"`,
      parameters: {
        max_new_tokens: 100, // 生成されるトークンの最大数
        temperature: 0.7, // ランダム性
      },
    });
    if (result && result.generated_text) {
      return result.generated_text.trim();
    } else if (Array.isArray(result)) {
      return result[0]?.generated_text || "変換ができませんでした。";
    } else {
      return "予期しないレスポンスが返されました。";
    }
  } catch (error) {
    console.error("Error with Hugging Face API:", error);
    throw new Error("API の呼び出し中にエラーが発生しました");
  }
};
