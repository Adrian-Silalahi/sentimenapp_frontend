import { Alert, Snackbar } from "@mui/material";
import React, { useState } from "react";

const PopUpAlert = ({ isPopUp, handleClosePopUp, alertMessage }) => {
  const handleSnackbarClose = (event, reason) => {
    if (reason === "escapeKeyDown") {
      return null;
    }
    handleClosePopUp();
  };

  return (
    <Snackbar
      open={isPopUp}
      autoHideDuration={2500}
      onClose={handleSnackbarClose}
      anchorOrigin={{ vertical: "top", horizontal: "center" }}
      sx={{ top: "50px !important" }}
    >
      <Alert
        onClose={handleClosePopUp}
        severity="success"
        sx={{ width: "100%" }}
      >
        {alertMessage}
      </Alert>
    </Snackbar>
  );
};

export default PopUpAlert;
