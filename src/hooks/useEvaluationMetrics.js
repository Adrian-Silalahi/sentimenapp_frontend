import { useState, useEffect } from "react";

const calculateMetrics = (actualLabels, predictedLabels) => {
  const labels = ["Positive", "Negative", "Neutral"];
  const totalData = actualLabels.length;

  // actualLabels = [
  //   ["Negative"],
  //   ["Positive"],
  //   ["Positive"],
  //   ...97
  // ]

  // predictedLabels = [
  //   ["Positive"],
  //   ["Positive"],
  //   ["Positive"]
  //   ...97
  // ]

  // 1. Inisialisasi Confusion Matrix dan Class Metrics

  // acc: Nilai hasil gabungan dari semua label
  const initialMatrix = labels.reduce((acc, label) => {
    acc[label] = labels.reduce((accNested, labelNested) => {
      accNested[labelNested] = 0;
      return accNested;
    }, {});
    return acc;
  }, {});

  //   {
  //    "Positive":  { "Positive" : 0, "Negative": 0, "Neutral": 0 },
  //   "Negative": { "Positive" : 0, "Negative": 0, "Neutral": 0 },
  //   "Neutral": { "Positive" : 0, "Negative": 0, "Neutral": 0 },
  // }

  const initialClassMetrics = labels.reduce((acc, label) => {
    acc[label] = {
      count: 0,
      precision: 0,
      recall: 0,
      f1Score: 0,
      accuracy: 0,
    };
    return acc;
  }, {});

  // {
  //   "Positive" : {count: 0, precision: 0, recall: 0, f1Score: 0, accuracy: 0},
  //   "Negative" : {count: 0, precision: 0, recall: 0, f1Score: 0, accuracy: 0},
  //   "Neutral" : {count: 0, precision: 0, recall: 0, f1Score: 0, accuracy: 0},
  // }

  const confusionMatrix = { ...initialMatrix };
  const classMetrics = { ...initialClassMetrics };

  // 2. Mengisi Confusion Matrix dan menghitung 'count' classMetrics
  for (let i = 0; i < totalData; i++) {
    const actual = actualLabels[i][0];
    const predicted = predictedLabels[i][0];

    if (labels.includes(actual) && labels.includes(predicted)) {
      confusionMatrix[actual][predicted]++;
      classMetrics[actual].count++;
    }
  }

  // 3. Menghitung metrik untuk setiap kelas (One-vs-Rest)
  let totalCorrectPredictions = 0;

  // Inisialisasi object baru untuk menyimpan matriks biner
  const binaryConfusionMatrix = {};

  labels.forEach((label) => {
    // TP (True Positive): Aktual 'label', prediksi juga 'label'
    const tp = confusionMatrix[label][label];

    // FN (False Negative): Aktual 'label', tapi prediksi 'bukan label'
    const fn = classMetrics[label].count - tp;

    // FP (False Positive): aktual 'bukan label' tapi prediksi 'label'
    let fp = 0;
    labels.forEach((otherLabel) => {
      if (otherLabel !== label) {
        fp += confusionMatrix[otherLabel][label];
      }
    });

    // TN (True Negative): Aktual 'bukan label' dan prediksi juga 'bukan label'
    const tn = totalData - tp - fp - fn;

    const precision = tp / (tp + fp) || 0; // Menghindari pembagian dengan nol
    const recall = tp / (tp + fn) || 0;
    const f1Score = (2 * precision * recall) / (precision + recall) || 0;

    // Perhitungan akurasi untuk kelas spesifik ini
    const accuracy = (tp + tn) / totalData || 0;

    // Menyimpan hasil perhitungan ke classMetrics
    classMetrics[label].precision = precision;
    classMetrics[label].recall = recall;
    classMetrics[label].f1Score = f1Score;
    classMetrics[label].accuracy = accuracy; // Menyimpan akurasi per kelas

    const positiveClass = label;
    const negativeClass = `Not ${label}`;

    binaryConfusionMatrix[label] = {
      // Baris Aktual Label
      [positiveClass]: {
        [positiveClass]: tp, // Kolom Prediksi: Positive (TP)
        [negativeClass]: fn, // Kolom Prediksi: Negative (FN)
      },
      // Baris Aktual Bukan Label
      [negativeClass]: {
        [positiveClass]: fp, // Kolom Prediksi: Positive (FP)
        [negativeClass]: tn, // Kolom Prediksi: Negative (TN)
      },
    };

    // Menambahkan prediksi benar untuk overall accuracy
    totalCorrectPredictions += tp;
  });

  console.log("binaryConfusionMatrix", binaryConfusionMatrix);

  // 4. Menghitung Akurasi Keseluruhan (Overall Accuracy)
  const overallAccuracy =
    totalData > 0 ? totalCorrectPredictions / totalData : 0;

  return {
    confusionMatrix,
    classMetrics,
    overallAccuracy,
    totalData,
    labels,
    binaryConfusionMatrix,
  };
};

export const useEvaluationMetrics = (actualLabels, predictedLabels) => {
  const [metrics, setMetrics] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (
      actualLabels.length > 0 &&
      predictedLabels.length > 0 &&
      actualLabels.length === predictedLabels.length
    ) {
      setIsLoading(true);
      const confusionMatrix = calculateMetrics(actualLabels, predictedLabels);
      setMetrics(confusionMatrix);
      setIsLoading(false);
    } else {
      // Handle kasus dimana data tidak valid atau kosong
      setMetrics(null);
      setIsLoading(false);
    }
  }, [actualLabels, predictedLabels]);

  return { metrics, isLoading };
};
