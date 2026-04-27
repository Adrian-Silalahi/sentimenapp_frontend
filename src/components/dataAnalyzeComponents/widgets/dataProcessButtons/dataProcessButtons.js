import React, { useState } from "react";
import { Box, Button } from "@mui/material";
import { ArrowBack, CloudDownload, RowingRounded } from "@mui/icons-material";
import "./dataProcessButtons.scss";
import * as api from "../../../../api/preprocess";

const DataProcessButtons = ({
  handleBack,
  isCurrentStepCompleted,
  indexStep,
  indexLastStep,
  handleNext,
  isLoading,
  completedList,
  downloadFileNames,
  setIsPopUp,
}) => {
  const evaluateStepIndex = 4;
  const robertaAnalysisIndex = 3;
  const isEvaluateComplete = completedList[4] === true;

  const handleDownloadDataset = async () => {
    try {
      const blob = await api.downloadPreprocessedFile(
        downloadFileNames[indexStep]
      );
      const downloadLink = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = downloadLink;
      a.download = downloadFileNames[indexStep];
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(downloadLink);
      setIsPopUp(true);
    } catch (error) {
      console.error("Download error:", error);
    }
  };

  if (isLoading) {
    return null;
  }

  // On the evaluation step, hide the button bar entirely —
  // navigation is done via the top stepper + back link inside EvaluatePaper
  if (indexStep === indexLastStep && isCurrentStepCompleted) {
    return null;
  }

  return (
    <Box className="data-process-button-box">
      <Box className="button-left-side">
        {indexStep === indexLastStep && isCurrentStepCompleted ? (
          <Button
            className="evaluation-back-button"
            color="inherit"
            variant="contained"
            onClick={handleBack}
            sx={{ mr: 1, color: "white", backgroundColor: "#2A2F33" }}
            startIcon={<ArrowBack />}
          >
            Back
          </Button>
        ) : (
          <Button
            className="regular-back-button"
            color="inherit"
            onClick={handleBack}
            sx={{ mr: 1 }}
          >
            Back
          </Button>
        )}
      </Box>

      <Box className="button-right-side">
        {isCurrentStepCompleted && indexStep !== evaluateStepIndex && (
          <Button
            variant="outlined"
            startIcon={<CloudDownload />}
            className="download-button"
            onClick={handleDownloadDataset}
            sx={{
              mr: 1,
              color: "rgb(10, 92, 92)", // Mengatur warna teks tombol
              borderColor: "rgb(10, 92, 92)", // Mengatur warna border
              "&:hover": {
                // Mengatur warna saat di-hover
                backgroundColor: "rgba(10, 92, 92, 0.08)", // Sedikit transparan untuk efek hover
                borderColor: "rgb(10, 92, 92)",
              },
            }}
          >
            Download Data
          </Button>
        )}

        {isCurrentStepCompleted &&
          indexStep !== evaluateStepIndex &&
          (indexStep === robertaAnalysisIndex && !isEvaluateComplete ? (
            <Button variant="contained" color="success" onClick={handleNext}>
              Evaluate
            </Button>
          ) : (
            <Button variant="contained" color="info" onClick={handleNext}>
              Next
            </Button>
          ))}
      </Box>
    </Box>
  );
};

export default DataProcessButtons;
