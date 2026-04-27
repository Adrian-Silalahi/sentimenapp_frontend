export const getCellColor = (value, isDiagonal, confusionMatrix) => {
  const maxValue = Math.max(
    ...Object.values(confusionMatrix).flatMap((row) => Object.values(row))
  );
  if (isDiagonal) {
    // Warna hijau untuk prediksi yang benar (diagonal)
    const opacity = maxValue > 0 ? 0.4 + (value / maxValue) * 0.6 : 0.4;
    return `rgba(34, 139, 34, ${value === 0 ? 0.15 : opacity})`;
  } else {
    // Warna merah untuk prediksi yang salah
    const opacity = maxValue > 0 ? 0.3 + (value / maxValue) * 0.7 : 0.3;
    return `rgba(211, 47, 47, ${value === 0 ? 0.1 : opacity})`;
  }
};

export const getScoreColor = (score) => {
  if (score >= 90) return "#2e7d32"; // Success
  if (score >= 70) return "#ed6c02"; // Warning
  return "#d32f2f"; // Error
};
