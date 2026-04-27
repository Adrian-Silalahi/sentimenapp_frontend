import { Typography, Paper } from "@mui/material";
import "./dataExtractPaper.scss";
import ScrapTable from "../../widgets/scrapTable/scrapTable";
import DataExtractButton from "../../widgets/dataExtractButtons/dataExtractButtons";

const DataExtractPaper = ({
  data,
  onDownload,
  isFileAvailable,
  handlePlatformChange,
}) => {
  return (
    <Paper elevation={3} className="table-paper" sx={{ pb: 0 }}>
      <Typography
        gutterBottom
        className="table-title"
        sx={{ fontWeight: "bold" }}
      >
        Count : {data.length} entries
      </Typography>

      <ScrapTable data={data} />
      <DataExtractButton
        data={data}
        handlePlatformChange={handlePlatformChange}
        onDownload={onDownload}
        isFileAvailable={isFileAvailable}
      />
    </Paper>
  );
};

export default DataExtractPaper;
