import { Typography, Box } from "@mui/material";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import "./infoFile.scss";
import { useSelector } from "react-redux";

const InfoFile = () => {
  const { info_file } = useSelector((state) => state.dataProcessing);
  return (
    <div className="file-added-section">
      <Box className="header-wrapper">
        <Typography className="info-file-header"> File Preview </Typography>
      </Box>
      <Box className="file-info-box">
        <InsertDriveFileIcon className="file-icon" />
        <Typography className="file-name">{info_file.name}</Typography>
        <Typography className="file-size">{info_file.size}</Typography>
      </Box>
    </div>
  );
};

export default InfoFile;
