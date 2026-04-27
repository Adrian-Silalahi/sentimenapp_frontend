import { useEffect, useState } from "react";
// @ts-ignore
import "./processPaper.scss";
import { Paper, Box } from "@mui/material";
import Table from "../../widgets/table/table";
import LoadingPreprocessing from "../../widgets/loadingSpinner/loadingSpinner";
import { useDispatch, useSelector } from "react-redux";
import { setTableBody, setTableHeaders } from "../../../../redux/tableSlice";
import { FileProcessingData } from "../../../../utils/fileProcessingData";
import { updateTableContent } from "../../../../utils/updateTableContent";
import { setActiveStep, setCompletedList } from "../../../../redux/stepslice";
import DataProcessButtons from "../../widgets/dataProcessButtons/dataProcessButtons";
import EvaluatePaper from "../evaluatePaper/evaluatePaper";
import StepperExplain from "../../widgets/stepperExplain/stepperExplain";
import PopUpAlert from "../../../dataExtractionComponents/widgets/popUpAlert/popUpAlert";

const AnyTable: any = Table;
const AnyDataProcessButtons: any = DataProcessButtons;

const steps = [
  "HTML Element Cleansing",
  "Normalize Text",
  "Vader Labeling",
  "Sentiment Analysis With Roberta (Testing)",
  "Evaluation Form",
];

const ProcessPaper = () => {
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
  } = useSelector((state: any) => state.dataProcessing);

  const { completedList } = useSelector((state: any) => state.stepProcessing);
  const { activeStep } = useSelector((state: any) => state.stepProcessing);
  const dispatch = useDispatch();

  useEffect(() => {
    setIsPopUp(false);
  }, [activeStep]);

  useEffect(() => {
    updateTableContent({
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
    } as any);

    const isPrepo1Empty = prepo_1.length === 0;
    if (activeStep === 1 && isPrepo1Empty) {
      handleProcess(activeStep);
    }
  }, [activeStep, prepo_1, prepo_2, vader_label, roberta, data_balance]);

  const totalSteps = steps.length;
  const indexStep = activeStep - 1;
  const indexLastStep = totalSteps - 1;
  const isCurrentStepCompleted = completedList[indexStep];
  const isEvaluate = activeStep === 5 && isCurrentStepCompleted;

  const handleClosePopUp = () => setIsPopUp(false);

  const checkStepCompleted = (indexStep: number) => {
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

  const handleProcess = (activeStep: number) => {
    setIsLoading(true);
    setTimeout(() => {
      FileProcessingData({
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
      } as any);
      // setIsLoading(false); dilakukan setelah perubahan data selesai yaitu ada di dalam fungsi "updateTableContent"
      // setStepToCompleted(); ini juga
    }, 1300);
  };

  return (
    <Paper elevation={0} className={`process-paper${isEvaluate ? " is-last-step" : ""}`}>
      {isLoading && <LoadingPreprocessing />}
      <Box className="content-above-button">
        {!isEvaluate && !isLoading && (
          <>
            <StepperExplain prepoStep={activeStep} isStepper={true} />
            <AnyTable
              isLoading={isLoading}
              tableHeaders={raw_data?.tableHeaders}
              tableBody={raw_data?.tableData}
            />
          </>
        )}

        {isEvaluate && <EvaluatePaper />}
      </Box>

      <AnyDataProcessButtons
        setIsPopUp={setIsPopUp}
        isPopUp={isPopUp}
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

export default ProcessPaper;
