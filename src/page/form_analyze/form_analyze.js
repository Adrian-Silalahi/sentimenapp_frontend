import React, { useState } from "react";
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  Paper,
  Fade,
} from "@mui/material";
import { predictTextSentimentAPI } from "../../api/predict";
import SentimentSatisfiedAltIcon from "@mui/icons-material/SentimentSatisfiedAlt";
import SentimentDissatisfiedIcon from "@mui/icons-material/SentimentDissatisfied";
import SentimentNeutralIcon from "@mui/icons-material/SentimentNeutral";
import AnalyzeIcon from "@mui/icons-material/Analytics"; // Ikon untuk Analyze box awal

import "./form_analyze.scss";

function FormAnalyze() {
  const [inputText, setInputText] = useState("");
  const [predictionLabel, setPredictionLabel] = useState("");
  const [predictionConfidence, setPredictionConfidence] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasResult, setHasResult] = useState(false);

  console.log("predictionLabel", predictionLabel);
  console.log("predictionConfidence", predictionConfidence);

  const getResultColor = (label) => {
    if (label.includes("Positive")) {
      return "#0cac9c";
    } else if (label.includes("Negative")) {
      return "#F44336";
    } else if (label.includes("Neutral")) {
      return "#E0E0E0";
    }
  };

  const handleAnalyze = async () => {
    setPredictionLabel("");
    setPredictionConfidence(null);
    setHasResult(false);

    if (!inputText.trim()) {
      // Logic jika input kosong
      setHasResult(false);
      return;
    }

    setIsLoading(true);
    try {
      const response = await predictTextSentimentAPI(inputText);
      setPredictionLabel(response.label);
      setPredictionConfidence(response.confidence);
      setHasResult(true);
    } catch (error) {
      console.error(error);
      setPredictionLabel("Error"); // Set label 'Error'
      setPredictionConfidence(null);
      setHasResult(true);
    } finally {
      setIsLoading(false);
    }
  };

  const getSentimentIcon = (label) => {
    if (label.includes("Positive")) {
      return <SentimentSatisfiedAltIcon sx={{ fontSize: 60, color: "#fff" }} />;
    } else if (label.includes("Negative")) {
      return <SentimentDissatisfiedIcon sx={{ fontSize: 60, color: "#fff" }} />;
    } else if (label.includes("Neutral")) {
      return <SentimentNeutralIcon sx={{ fontSize: 60, color: "#fff" }} />;
    } else {
      // 'Error' atau belum ada hasil
      return <AnalyzeIcon sx={{ fontSize: 60, color: "#bdbdbd" }} />; // Warna abu-abu untuk ikon default
    }
  };

  return (
    <Container maxWidth={false} className="form-analyze">
      <Paper
        elevation={9}
        sx={{
          p: 4,
          borderRadius: 3,
          width: "550px",
          height: "600px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-around",
        }}
      >
        <TextField
          label="Your Text"
          placeholder="Type something here..."
          multiline
          fullWidth
          minRows={10}
          variant="outlined"
          value={inputText}
          onChange={(e) => {
            setInputText(e.target.value);
            if (hasResult) {
              setPredictionLabel("");
              setPredictionConfidence(null);
              setHasResult(false);
            }
          }}
        />

        <Box textAlign="center" mt={3}>
          <Button
            variant="contained"
            onClick={handleAnalyze}
            disabled={isLoading}
            sx={{
              px: 5,
              py: 1.5,
              backgroundColor: "#000",
              borderRadius: "12px",
              "&:hover": {
                backgroundColor: "#333",
              },
            }}
          >
            {isLoading ? "Analyzing..." : "Analyze"}
          </Button>
        </Box>

        <Box mt={4}>
          <Typography variant="subtitle2" gutterBottom>
            Prediction Result
          </Typography>

          {!hasResult ? (
            <Fade in={!hasResult} timeout={500}>
              <Paper
                elevation={1}
                sx={{
                  p: 2,
                  borderRadius: 2,
                  minHeight: 100,
                  // MODIFIKASI WARNA TAMPILAN AWAL DI SINI
                  backgroundColor: "white", // Warna putih bersih
                  border: "1px dashed #bdbdbd", // Border putus-putus abu-abu
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#757575", // Warna teks abu-abu
                }}
              >
                <AnalyzeIcon sx={{ fontSize: 60, color: "#bdbdbd", mb: 1 }} />
                <Typography variant="body1" align="center">
                  Enter text and click "Analyze" to see the sentiment
                  prediction.
                </Typography>
              </Paper>
            </Fade>
          ) : (
            <Fade in={hasResult} timeout={500}>
              <Paper
                elevation={1}
                sx={{
                  p: 2,
                  borderRadius: 2,
                  minHeight: 100,
                  backgroundColor: getResultColor(predictionLabel),
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {getSentimentIcon(predictionLabel)}
                <Typography
                  variant="h6"
                  sx={{ color: "#fff", fontWeight: "bold" }}
                >
                  {predictionLabel}
                </Typography>
                {predictionConfidence !== null && (
                  <Typography variant="body2" sx={{ color: "#fff" }}>
                    Confidence: {predictionConfidence}
                  </Typography>
                )}
              </Paper>
            </Fade>
          )}
        </Box>
      </Paper>
    </Container>
  );
}

export default FormAnalyze;
