export function countSentiments(dataArray, setLabelCount) {
  const counts = {
    Positive: 0,
    Neutral: 0,
    Negative: 0,
  };

  if (dataArray.length > 0) {
    dataArray.forEach((item) => {
      if (item === "Positive") {
        counts.Positive += 1;
      } else if (item === "Neutral") {
        counts.Neutral += 1;
      } else if (item === "Negative") {
        counts.Negative += 1;
      }
    });
  }
  setLabelCount(counts);
  // return counts;
}
