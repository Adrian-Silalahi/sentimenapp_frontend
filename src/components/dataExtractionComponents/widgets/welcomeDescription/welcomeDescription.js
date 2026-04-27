import React from "react";
import { Box, Typography, Fade } from "@mui/material";
import StorageIcon from "@mui/icons-material/Storage";
import "./welcomeDescription.scss";

const WelcomeDescription = ({ selectedPlatform }) => {
  return (
    <Fade in={selectedPlatform === ""} timeout={500}>
      <Box className="welcome-box">
        <Box className="texture-overlay" />
        <StorageIcon className="storage-icon" color="secondary" />
        <Typography
          variant="h5"
          component="p"
          gutterBottom
          className="welcome-title"
          color="text.primary"
        >
          Start Your Data Extraction!
        </Typography>
        <Typography
          variant="body1"
          className="welcome-body"
          color="text.secondary"
        >
          Please select a platform from the dropdown above to get the dataset
          you need.
        </Typography>
      </Box>
    </Fade>
  );
};

export default WelcomeDescription;
