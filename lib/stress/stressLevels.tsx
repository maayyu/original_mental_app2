export const getStressLevel = (percentageScore: number) => {
  if (percentageScore >= 0 && percentageScore <= 14) return "非常に低い";
  if (percentageScore >= 15 && percentageScore <= 28) return "低い";
  if (percentageScore >= 29 && percentageScore <= 42) return "やや低い";
  if (percentageScore >= 43 && percentageScore <= 57) return "普通";
  if (percentageScore >= 58 && percentageScore <= 71) return "やや高い";
  if (percentageScore >= 72 && percentageScore <= 85) return "高い";
  if (percentageScore >= 86 && percentageScore <= 100) return "非常に高い";
};
