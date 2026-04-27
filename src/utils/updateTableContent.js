export const updateTableContent = ({
  activeStep,
  prepo_1,
  prepo_2,
  vader_label,
  roberta,
  dispatch,
  setTableBody,
  setTableHeaders,
  setIsLoading,
  setStepToCompleted,
}) => {
  switch (activeStep) {
    case 1:
      if (prepo_1.length > 0) {
        dispatch(setTableHeaders(["HTML element cleansing result"]));
        dispatch(setTableBody(prepo_1));
        setIsLoading(false);
        setStepToCompleted();
      }
      break;

    case 2:
      if (prepo_2.length > 0) {
        dispatch(setTableHeaders(["Normalize text result"]));
        dispatch(setTableBody(prepo_2));
        setIsLoading(false);
        setStepToCompleted();
      }
      break;

    case 3:
      if (vader_label.length > 0) {
        const combined = prepo_2.map((item, index) => [
          ...item,
          vader_label[index],
        ]);
        dispatch(
          setTableHeaders(["Text preprocessing result", "Actual label"])
        );
        dispatch(setTableBody(combined));
        setIsLoading(false);
        setStepToCompleted();
      }
      break;

    case 4:
      if (roberta.length > 0) {
        const combinedWithoutBalance = prepo_2.map((data, index) => [
          ...data,
          vader_label[index],
          roberta[index][1],
          roberta[index][2],
        ]);

        dispatch(
          setTableHeaders([
            "Text preprocessing result",
            "Actual label",
            "Prediction result",
            "Confidence",
          ])
        );
        dispatch(setTableBody(combinedWithoutBalance));
        setIsLoading(false);
        setStepToCompleted();
      }
      break;

    case 5:
      setStepToCompleted();
      setIsLoading(false);

    default:
      break;
  }
};
