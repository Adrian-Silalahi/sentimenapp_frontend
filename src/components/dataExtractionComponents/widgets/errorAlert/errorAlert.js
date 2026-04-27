import { Alert } from "@mui/material";
import React from "react";

const ErrorAlert = ({ statusMessage }) => {
  return (
    <Alert severity={"error"} sx={{ mt: 1, width: "97%", mx: "auto" }}>
      {statusMessage.message}
    </Alert>
  );
};

export default ErrorAlert;
