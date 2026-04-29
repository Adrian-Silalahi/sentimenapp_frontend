import React from "react";
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
  activeStep,
}) => {
  const balancingIndex = 3;
  const isFinetuneComplete = completedList[4] === true;

  if (isLoading) {
    return null;
  }

  const handleDownloadDataset = async () => {
    try {
      const blob = await api.downloadPreprocessedFile(
        downloadFileNames[indexStep],
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

  return (
    <Box className="data-process-button-box">
      {activeStep !== 5 && (
        <Box className="button-left-side">
          <Button
            className="regular-back-button"
            color="inherit"
            onClick={handleBack}
            sx={{ mr: 1 }}
          >
            Back
          </Button>
        </Box>
      )}

      <Box
        className="button-right-side"
        sx={{ display: "flex", flexDirection: "row" }}
      >
        {isCurrentStepCompleted && indexStep <= balancingIndex && (
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

        {indexStep === balancingIndex && !isFinetuneComplete ? (
          <Button
            variant="contained"
            onClick={handleNext}
            sx={{
              display: "flex",
              flexDirection: "column",
              backgroundColor: "#6d28d9",
            }}
          >
            Fine-Tune with this data
          </Button>
        ) : (
          indexStep !== indexLastStep && (
            <Button
              variant="contained"
              onClick={handleNext}
              sx={{
                backgroundColor: "#7c3aed",
                "&:hover": { backgroundColor: "#6d28d9" },
              }}
            >
              Next
            </Button>
          )
        )}
      </Box>
    </Box>
  );
};

export default DataProcessButtons;
