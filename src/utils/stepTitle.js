export const StepTitle = ({ activeStep }) => {
  const steps = [
    "Pembersihan HTML",
    "Pembersihan Noise Lanjutan",
    "Normalisasi Spasi",
    "Analisis sentimen",
  ];

  return (
    <div className="processing-step">
      <h2>{steps[activeStep]}</h2>
    </div>
  );
};
