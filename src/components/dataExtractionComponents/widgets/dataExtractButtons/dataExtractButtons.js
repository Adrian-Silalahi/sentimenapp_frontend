import { Box, Button } from "@mui/material";
import { CloudDownload } from "@mui/icons-material";
import StartOutlinedIcon from "@mui/icons-material/StartOutlined";
import "./dataExtractButtons.scss";
import Swal from "sweetalert2";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setTableBody, setTableHeaders } from "../../../../redux/tableSlice";
import { setRawData } from "../../../../redux/dataSlice";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome"; // Ikon baru untuk mode simulasi

const DataExtractButtons = ({
  onDownload,
  isFileAvailable,
  handlePlatformChange,
  data,
}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const convertToArrayOfArray = (data) => {
    const arrayOfArray = [];
    for (let i = 0; i < data.length; i++) {
      arrayOfArray.push([data[i]]);
    }
    return arrayOfArray;
  };

  const handleGoToAnalyzeData = () => {
    const arrayOfArrayData = convertToArrayOfArray(data);
    dispatch(setRawData({ headers: ["message"], tableData: arrayOfArrayData }));
    dispatch(setTableHeaders(["message"]));
    dispatch(setTableBody(arrayOfArrayData));
    navigate("/file-based-analysis?from=data-extraction");
  };

  const handleGoToFineTune = () => {
    const arrayOfArrayData = convertToArrayOfArray(data);
    dispatch(setRawData({ headers: ["message"], tableData: arrayOfArrayData }));
    dispatch(setTableHeaders(["message"]));
    dispatch(setTableBody(arrayOfArrayData));
    navigate("/roberta-builder-simulator?from=data-extraction");
  };

  const handleBack = () => {
    Swal.fire({
      title: "Confirm Go Back",
      text: "Are you sure you want to go back? Dataset will be lost, and you will need to fetch it again.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Go Back!",
      cancelButtonText: "Cancel",
      reverseButtons: true,
    }).then((result) => {
      if (result.isConfirmed) {
        handlePlatformChange({ target: { value: "" } });
      }
    });
    // handlePlatformChange({ target: { value: "" } });
  };

  return (
    <Box fullWidth className="button-container">
      <Box className="button-left-side">
        <Button
          color="inherit"
          onClick={() => {
            handleBack();
          }}
          sx={{ mr: 4 }}
        >
          Back
        </Button>

        <Button
          variant="outlined"
          onClick={onDownload}
          disabled={!isFileAvailable}
          startIcon={<CloudDownload />}
          className="download-button"
        >
          Download Dataset
        </Button>
      </Box>

      <Box className="button-right-side">
        <Button
          variant="contained"
          onClick={handleGoToAnalyzeData}
          sx={{
            // background: "linear-gradient(to right, #4a90e2, #357abd)",
            color: "#fff",
            borderRadius: "999px",
            textTransform: "none",
            fontWeight: "bold",
            mr: 2,
          }}
        >
          Proceed to Sentiment Analysis
        </Button>
        <Button
          variant="contained"
          onClick={handleGoToFineTune}
          color="primary"
          sx={{
            background: "linear-gradient(to right, #4a90e2, #357abd)",
            color: "#fff",
            borderRadius: "999px",
            textTransform: "none",
            fontWeight: "bold",
          }}
          endIcon={<AutoAwesomeIcon sx={{ color: "yellow" }} />}
        >
          Proceed to Model Fine-Tuning
        </Button>
      </Box>
    </Box>
  );
};

export default DataExtractButtons;
