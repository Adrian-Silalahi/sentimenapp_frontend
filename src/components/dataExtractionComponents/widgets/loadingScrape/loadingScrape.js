import React from "react";
import {
  Box,
  CircularProgress,
  LinearProgress,
  Typography,
} from "@mui/material";

const LoadingScrape = ({ statusMessage }) => {
  return (
    <Box
      sx={{
        width: "100%",
        mt: 3,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <CircularProgress color="primary" size={60} sx={{ mb: 2 }} />
      {/* <LinearProgress
        sx={{ width: "80%", height: 8, borderRadius: 5, mb: 1 }}
      /> */}
      <Typography
        variant="body2"
        color="text.secondary"
        align="center"
        sx={{ mt: 1 }}
      >
        {statusMessage.message}
      </Typography>
    </Box>
  );
};

export default LoadingScrape;
