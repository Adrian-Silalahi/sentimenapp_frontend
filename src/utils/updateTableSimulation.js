export const updateTableSimulation = ({
  activeStep,
  prepo_1,
  prepo_2,
  vader_label,
  data_balance,
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
      if (data_balance.length > 0) {
        dispatch(setTableHeaders(["Data Balancing result", "Actual label"]));
        dispatch(setTableBody(data_balance));
        setIsLoading(false);
        setStepToCompleted();
      }
      break;

    case 5:
      setIsLoading(false);

    default:
      break;
  }
};
