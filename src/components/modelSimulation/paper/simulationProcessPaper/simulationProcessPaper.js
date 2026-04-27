import { useEffect, useState } from "react";
import "./simulationProcessPaper.scss";
import { Paper, Box } from "@mui/material";
import Table from "../../widgets/table/table";
import LoadingPreprocessing from "../../widgets/loadingSpinner/loadingSpinner";
import { useDispatch, useSelector } from "react-redux";
import { setTableBody, setTableHeaders } from "../../../../redux/tableSlice";
import { SimulationProcessingData } from "../../../../utils/simulationProcessingData";
import { updateTableSimulation } from "../../../../utils/updateTableSimulation";
import { setActiveStep, setCompletedList } from "../../../../redux/stepslice";
import DataProcessButtons from "../../widgets/dataProcessButtons/dataProcessButtons";
import FineTunePaper from "../fineTunePaper/fineTunePaper";
import StepperExplain from "../../widgets/stepperExplain/stepperExplain";
import PopUpAlert from "../../../dataExtractionComponents/widgets/popUpAlert/popUpAlert";

const steps = [
  "HTML Element Cleansing",
  "Normalize Text",
  "Vader Labeling",
  "Data Balancing",
  "RoBERTa Fine-tuning",
];

const SimulationProcessPaper = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isPopUp, setIsPopUp] = useState(false);
  const {
    prepo_1,
    prepo_2,
    vader_label,
    data_balance,
    roberta,
    raw_data,
    download_file_names,
  } = useSelector((state) => state.dataProcessing);

  const { completedList } = useSelector((state) => state.stepProcessing);
  const { activeStep } = useSelector((state) => state.stepProcessing);
  const dispatch = useDispatch();

  useEffect(() => {
    updateTableSimulation({
      activeStep,
      prepo_1,
      prepo_2,
      vader_label,
      data_balance,
      roberta,
      dispatch,
      setTableBody,
      setTableHeaders,
      setIsLoading,
      setStepToCompleted,
    });

    const isPrepo1Empty = prepo_1.length === 0;
    if (activeStep === 1 && isPrepo1Empty) {
      handleProcess(activeStep);
    }
  }, [activeStep, prepo_1, prepo_2, vader_label, roberta, data_balance]);

  const totalSteps = steps.length;
  const indexStep = activeStep - 1;
  const indexLastStep = totalSteps - 1;
  const isCurrentStepCompleted = completedList[indexStep];
  const isFineTune = activeStep === 5;

  const handleClosePopUp = () => setIsPopUp(false);

  const checkStepCompleted = (indexStep) => {
    if (!completedList[indexStep]) return false;
    return true;
  };

  const handleNext = () => {
    const newActiveStep =
      indexStep !== indexLastStep ? activeStep + 1 : indexLastStep;
    dispatch(setActiveStep(newActiveStep));
    handleProcess(newActiveStep);
  };

  const handleBack = () => {
    dispatch(setActiveStep(activeStep - 1));
  };

  const setStepToCompleted = () => {
    const newCompleted = { ...completedList };
    newCompleted[indexStep] = true;
    dispatch(setCompletedList(newCompleted));
  };

  const handleProcess = (activeStep) => {
    setIsLoading(true);
    setTimeout(() => {
      SimulationProcessingData({
        dispatch,
        activeStep,
        raw_data,
        prepo_1,
        prepo_2,
        vader_label,
        data_balance,
        roberta,
        setStepToCompleted,
        setIsLoading,
        download_file_names,
      });
      // setIsLoading(false); dilakukan setelah perubahan data selesai yaitu ada di dalam fungsi "updateTableContent"
      // setStepToCompleted(); ini juga
    }, 1300);
  };

  return (
    <Paper elevation={0} className="process-paper">
      {isLoading && <LoadingPreprocessing />}
      <Box className="content-above-button">
        {!isLoading && !isFineTune && (
          <>
            <StepperExplain prepoStep={activeStep} isStepper={true} />
            <Table
              isLoading={isLoading}
              tableHeaders={raw_data?.tableHeaders}
              tableBody={raw_data?.tableData}
            />
          </>
        )}

        {isFineTune && <FineTunePaper />}
      </Box>

      <DataProcessButtons
        downloadFileNames={download_file_names}
        handleBack={handleBack}
        handleNext={handleNext}
        isCurrentStepCompleted={isCurrentStepCompleted}
        isLoading={isLoading}
        indexStep={indexStep}
        indexLastStep={indexLastStep}
        handleProcess={handleProcess}
        completedList={completedList}
      />

      <PopUpAlert
        isPopUp={isPopUp}
        handleClosePopUp={handleClosePopUp}
        alertMessage={"Download initiated! Please check your downloads folder"}
      />
    </Paper>
  );
};

export default SimulationProcessPaper;
