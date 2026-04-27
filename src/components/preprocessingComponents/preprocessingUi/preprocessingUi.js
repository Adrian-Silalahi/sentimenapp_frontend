import React, { useState } from "react";
import { Box, Button, Paper, ThemeProvider, Typography } from "@mui/material";
import { dataExtractionTheme } from "../../../utils/dataExtractionTheme";
import StepperExplain from "../../dataAnalyzeComponents/widgets/stepperExplain/stepperExplain";
import DropzonePrepo from "../dropzonePrepo/dropzonePrepo";
import "./preprocessingUi.scss";
import { CloudDownload } from "@mui/icons-material";
import ReplayOutlinedIcon from "@mui/icons-material/ReplayOutlined";
import { setTableBody, setTableHeaders } from "../../../redux/tableSlice";
import { prepoProcessingData } from "../../../utils/prepoProcessingData";
import { useDispatch, useSelector } from "react-redux";
import * as api from "../../../api/pipelinePreprocess";

const PreprocessingUi = ({ preprocessingTitle, preproStep }) => {
  const indexStep = preproStep - 1;
  const [isLoading, setIsLoading] = useState(false);
  const [isPopUp, setIsPopUp] = useState(false);
  const [isProcessComplete, setIsProcessComplete] = useState(false);
  const { table_body } = useSelector((state) => state.tableData);
  const { download_file_names } = useSelector((state) => state.dataProcessing);
  const dispatch = useDispatch();

  const handleReupload = () => {
    dispatch(setTableBody([]));
    dispatch(setTableHeaders([]));
    setIsProcessComplete(false);
  };

  const handleDownloadDataset = async () => {
    try {
      const blob = await api.downloadPreprocessedFile(
        download_file_names[indexStep],
      );
      const downloadLink = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = downloadLink;
      a.download = download_file_names[indexStep];
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(downloadLink);
      setIsPopUp(true);
    } catch (error) {
      console.error("Download error:", error);
    }
  };

  const handleProcess = () => {
    prepoProcessingData(
      preproStep,
      dispatch,
      table_body,
      setIsLoading,
      setIsProcessComplete,
      download_file_names,
    );
  };

  return (
    <ThemeProvider theme={dataExtractionTheme}>
      <Paper
        elevation={0}
        className="preprocessing-paper"
        sx={{
          pb: 2,
          boxSizing: "border-box",
        }}
      >
        <Box className="content-above-button">
          <StepperExplain prepoStep={preproStep} />
          <DropzonePrepo
            isLoading={isLoading}
            tableBody={table_body}
            preproStep={preproStep}
          />
        </Box>

        {table_body.length > 0 && (
          <div class="text-preprocessing-button">
            <div class="left-side">
              <Button
                variant="contained"
                className="reupload-button"
                onClick={() => {
                  handleReupload();
                }}
                endIcon={<ReplayOutlinedIcon />}
              >
                Upload Ulang
              </Button>
            </div>
            <div className="right-side">
              {isProcessComplete ? (
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
              ) : (
                <Button
                  variant="contained"
                  color="info"
                  onClick={() => {
                    handleProcess();
                  }}
                >
                  Process Data
                </Button>
              )}
            </div>
          </div>
        )}
      </Paper>
    </ThemeProvider>
  );
};

export default PreprocessingUi;
