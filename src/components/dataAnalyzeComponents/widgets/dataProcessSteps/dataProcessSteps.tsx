import React from "react";
import { Box, Stepper, Step, StepButton } from "@mui/material";

// Define the interface for the component's props
interface DataProcessStepsProps {
  steps: string[];
  indexStep: number;
  completedList: Record<number, boolean>;
  checkStepCompleted: (indexStep: number) => boolean;
  handleStep: (indexClickedStep: number) => () => void;
  // theme: "blue" = file analysis, "purple" = model builder
  theme?: "blue" | "purple";
}

const DataProcessSteps: React.FC<DataProcessStepsProps> = ({
  steps,
  indexStep,
  completedList,
  checkStepCompleted,
  handleStep,
  theme = "blue",
}) => {
  const activeColor = theme === "purple" ? "#7c3aed" : "#1976d2";
  const completedColor = "#059669"; // Emerald 600 - green for all completed steps

  return (
    <Box sx={{ width: "100%", px: 2 }}>
      <Stepper nonLinear activeStep={indexStep}>
        {steps.map((label, index) => {
          const isCompleted = completedList[index] === true;
          const isActive = indexStep === index;
          const isDisabled = !checkStepCompleted(index);

          return (
            <Step key={label} completed={isCompleted}>
              <StepButton
                color="inherit"
                onClick={handleStep(index)}
                disabled={isDisabled}
                sx={{
                  ".MuiStepLabel-iconContainer": {
                    transform: isActive ? "scale(1.1)" : "scale(0.85)",
                    transition: "transform 0.2s ease",
                  },
                  ".MuiStepIcon-root": {
                    // Completed = green, active = theme color, disabled = gray
                    ...(isCompleted
                      ? {
                          color: completedColor,
                          "& .MuiStepIcon-text": { fill: "#fff" },
                        }
                      : isActive
                        ? {
                            color: activeColor,
                            "& .MuiStepIcon-text": { fill: "#fff" },
                          }
                        : {
                            color: "#9ca3af",
                            "& .MuiStepIcon-text": { fill: "#fff" },
                          }),
                  },
                  ".MuiStepLabel-label": {
                    fontSize: "0.75rem",
                    fontWeight: isActive ? 700 : isCompleted ? 600 : 400,
                    color: isCompleted
                      ? completedColor
                      : isActive
                        ? activeColor
                        : "#6b7280",
                  },
                  // Override MUI completed check color
                  "& .MuiStepIcon-root.Mui-completed": {
                    color: completedColor,
                  },
                  "& .MuiStepIcon-root.Mui-active": {
                    color: activeColor,
                  },
                }}
              >
                {label}
              </StepButton>
            </Step>
          );
        })}
      </Stepper>
    </Box>
  );
};

export default DataProcessSteps;
