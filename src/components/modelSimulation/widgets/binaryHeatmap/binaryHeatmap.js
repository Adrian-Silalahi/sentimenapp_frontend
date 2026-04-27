import {
  Box,
  Grid,
  TableContainer,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from "@mui/material";
import "./binaryHeatmap.scss";
import { getCellColor } from "../../../../utils/evaluateColor";

export const BinaryHeatmap = ({ matrixData, primaryClass }) => {
  const positiveClass = primaryClass;
  const negativeClass = `Not ${primaryClass}`;
  const labels = [positiveClass, negativeClass];

  return (
    <Grid item className="heatmap-container" sx={{ width: "60%" }}>
      <div className="predicted-label">Predicted Labels</div>
      <Box className="heatmap-wrapper">
        <div className="actual-label">Actual Labels</div>
        <TableContainer
          component={Paper}
          elevation={1}
          className="table-container"
        >
          <Table className="table-layout-fixed">
            <TableHead>
              <TableRow>
                {/* Sel kosong di pojok kiri atas */}
                <TableCell className="hidden-header-cell" />
                {labels.map((label) => (
                  <TableCell key={label} align="center" className="header-cell">
                    {label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {labels.map((actualLabel, rowIndex) => (
                <TableRow key={actualLabel}>
                  {/* Header untuk label aktual */}
                  <TableCell
                    component="th"
                    scope="row"
                    className="row-header-cell"
                  >
                    {actualLabel}
                  </TableCell>
                  {labels.map((predictedLabel, colIndex) => {
                    const value = matrixData[actualLabel][predictedLabel];
                    const isDiagonal = rowIndex === colIndex;
                    return (
                      <TableCell
                        key={predictedLabel}
                        align="center"
                        className="data-cell" // Gaya statis dari SCSS
                        sx={{
                          // Gaya dinamis tetap di sini
                          backgroundColor: getCellColor(
                            value,
                            isDiagonal,
                            matrixData
                          ),
                        }}
                        title={`Actual: ${actualLabel}, Predicted: ${predictedLabel}, Count: ${value}`}
                      >
                        {value}
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Grid>
  );
};
