import { Box, Button } from "@mui/material";
import React from "react";
import "./stepButton.scss";

export const StepButton = ({ handleNextStep, currentStep }) => {
  return (
    <Box className="analyze-button-wrapper">
      <Button
        variant="outlined"
        color="primary"
        size="large"
        onClick={handleNextStep}
      >
        {currentStep == 0 ? "Start Preprocessing" : "Next"}
      </Button>
    </Box>
  );
};
