import { Box, Button, Paper } from "@mui/material";
import "./simulationPreviewPaper.scss";
import InfoFile from "../../widgets/infoFile/infoFile";
import Table from "../../widgets/table/table";
import Swal from "sweetalert2"; // Import SweetAlert2
import { useDispatch } from "react-redux";
import { useState } from "react";
import LoadingSpinner from "../../widgets/loadingSpinner/loadingSpinner";
import { setActiveStep } from "../../../../redux/stepslice";

const PreviewPaper = ({ resetState }) => {
  const [isLoading, setIsLoading] = useState(false);

  const dispatch = useDispatch();

  const backToDropzone = () => {
    const includeResetError = true;
    resetState(includeResetError);
  };

  const handleBack = () => {
    Swal.fire({
      title: "Confirm Go Back",
      text: "Are you sure you want to go back? The uploaded file data will be lost, and you will need to upload it again.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      cancelButtonText: "Cancel",
      confirmButtonText: "Yes, Go Back!",
      reverseButtons: true,
    }).then((result) => {
      if (result.isConfirmed) {
        backToDropzone();
      }
    });
    // backToDropzone();
  };

  const handleAnalyze = () => {
    dispatch(setActiveStep(1));
  };
  return (
    <Paper elevation={0} className="preview-paper">
      {!!isLoading && <LoadingSpinner />}
      <Box className="content-above-button">
        {/* Info File */}
        {<InfoFile />}
        <Table />
      </Box>
      <Box className="button-box">
        <Button
          color="inherit"
          onClick={() => {
            handleBack();
          }}
        >
          Back
        </Button>
        <Button
          className="preprocessing-button"
          variant="contained"
          onClick={() => {
            handleAnalyze();
          }}
          sx={{
            backgroundColor: "#7c3aed",
            "&:hover": { backgroundColor: "#6d28d9" },
          }}
        >
          Next
        </Button>
      </Box>
    </Paper>
  );
};

export default PreviewPaper;
