import React from "react";
import { Box, CircularProgress, Typography } from "@mui/material";

export const LoadingUploadFile = () => {
  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      sx={{ p: 3, flexDirection: "column", minHeight: "200px" }}
    >
      <CircularProgress />
      <Typography sx={{ mt: 2 }}>Processing file...</Typography>
    </Box>
  );
};
