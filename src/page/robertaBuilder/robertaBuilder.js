import React, { useEffect, useState } from "react";
import { Container, ThemeProvider } from "@mui/material";
import "./robertaBuilder.scss";
import { LoadingUploadFile } from "../../components/atomComponents/loadingUploadFile";
import SimulationPreviewPaper from "../../components/modelSimulation/paper/simulationPreviewPaper/simulationPreviewPaper";
import SimulationProcessPaper from "../../components/modelSimulation/paper/simulationProcessPaper/simulationProcessPaper";
import SimulationDropzonePaper from "../../components/modelSimulation/paper/simulationDropzonePaper/simulationDropzonePaper";
import { useDispatch, useSelector } from "react-redux";
import { resetTableData } from "../../redux/tableSlice";
import { resetCompletedList, setActiveStep } from "../../redux/stepslice";
import { resetProcessedData } from "../../redux/dataSlice";
import { dataExtractionTheme } from "../../utils/dataExtractionTheme";
import { resetFineTune } from "../../redux/fineTuneSlice";
import { useLocation } from "react-router-dom";
import DataProcessSteps from "../../components/modelSimulation/widgets/dataProcessSteps/dataProcessSteps";

const steps = [
  "Upload Dataset",
  "HTML Element Cleansing",
  "Normalize Text",
  "Vader Labeling",
  "Data Balancing",
  "RoBERTa Fine-tuning",
];

function RobertaBuilder() {
  const dispatch = useDispatch();

  const [isLoadingUpload, setIsLoadingUpload] = useState(false);
  const [error, setError] = useState("");
  const { activeStep, completedList } = useSelector((state) => state.stepProcessing);
  const { table_body } = useSelector((state) => state.tableData);

  const isHasData = table_body?.length > 0 && !isLoadingUpload && !error;

  const stepperCompletedList = {
    0: isHasData,
    1: completedList[0] || false,
    2: completedList[1] || false,
    3: completedList[2] || false,
    4: completedList[3] || false,
    5: completedList[4] || false,
  };

  const checkStepCompleted = (indexStep) => {
    return !!stepperCompletedList[indexStep];
  };

  const handleStep = (indexClickedStep) => () => {
    if (checkStepCompleted(indexClickedStep)) {
      dispatch(setActiveStep(indexClickedStep));
    }
  };

  const resetState = (errorReset) => {
    dispatch(resetTableData());
    dispatch(resetCompletedList());
    dispatch(resetProcessedData());
    dispatch(resetFineTune());
    setIsLoadingUpload(false);
    if (errorReset === true) {
      setError("");
    } else {
      return null;
    }
  };

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const from = queryParams.get("from");

  useEffect(() => {
    dispatch(setActiveStep(0));
    if (from !== "data-extraction") {
      const includeErrorReset = true;
      resetState(includeErrorReset);
    }
    return () => {
      dispatch(setActiveStep(0));
      const includeErrorReset = true;
      resetState(includeErrorReset);
    };
  }, []);

  return (
    <ThemeProvider theme={dataExtractionTheme}>
      <Container maxWidth="xl" className="data-analyze-container">
        <div className="w-full bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 py-3 px-4">
          <DataProcessSteps
            steps={steps}
            indexStep={activeStep}
            completedList={stepperCompletedList}
            checkStepCompleted={checkStepCompleted}
            handleStep={handleStep}
            theme="purple"
          />
        </div>

        <div className="flex-1 flex flex-col items-center py-6 px-4 w-full">
          {/* Tampilaan Jika loading upload file*/}
          {isLoadingUpload && <LoadingUploadFile />}

          {!isLoadingUpload && !isHasData && (
            <div className="w-full max-w-3xl">
              <SimulationDropzonePaper
                isLoadingUpload={isLoadingUpload}
                error={error}
                setIsLoadingUpload={setIsLoadingUpload}
                setError={setError}
                resetState={resetState}
                mode="simulation"
              />
            </div>
          )}

          {isHasData && activeStep === 0 && (
            <SimulationPreviewPaper resetState={resetState} />
          )}

          {isHasData && activeStep >= 1 && (
            <div className="w-full">
              <SimulationProcessPaper />
            </div>
          )}
        </div>
      </Container>
    </ThemeProvider>
  );
}

export default RobertaBuilder;
