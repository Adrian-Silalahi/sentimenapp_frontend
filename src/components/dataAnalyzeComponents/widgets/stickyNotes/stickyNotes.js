import React from "react";
import { Box, Grid, Paper, Typography } from "@mui/material";
import PushPinIcon from "@mui/icons-material/PushPin";
import CountUp from "react-countup";
import "./stickyNotes.scss";

const StickyNotes = ({ overallAccuracy, totalData }) => {
  return (
    <Grid container spacing={4} sx={{ mb: 4, justifyContent: "center" }}>
      <Grid item xs={12} sm={6} md={5}>
        <Box className="sticky-notes-accuracy">
          <PushPinIcon className="push-pin-icon" />
          <Typography color="#5d4037" sx={{ mt: 2 }} gutterBottom>
            {" "}
            Akurasi Keseluruhan{" "}
          </Typography>
          <Typography
            variant="h2"
            className="accuracy-text"
            sx={{ fontFamily: "Poppins, sans-serif", fontWeight: "700" }}
          >
            <CountUp end={overallAccuracy * 100} duration={2} decimals={2} />%
          </Typography>
        </Box>
      </Grid>
      <Grid item xs={12} sm={6} md={5}>
        <Box elevation={0} className="sticky-notes-total-data">
          <PushPinIcon className="push-pin-icon" />
          <Typography color="#5d4037" sx={{ mt: 2 }} gutterBottom>
            {" "}
            Total Data{" "}
          </Typography>
          <Typography
            variant="h2"
            sx={{
              fontFamily: "Poppins, sans-serif",
              fontWeight: "700",
              color: "#01579b",
            }}
          >
            <CountUp end={totalData} duration={1.5} />
          </Typography>
        </Box>
      </Grid>
    </Grid>
  );
};

export default StickyNotes;
