import React from "react";
import {
  Grid,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import { getCellColor } from "../../../../utils/evaluateColor";
import "./heatMap.scss";

const HeatMap = ({ labels, confusionMatrix, width }) => {
  return (
    <Grid item className="heatmap-container" sx={{ width: width }}>
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

                {/* Header untuk label prediksi */}
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

                  {/* Sel data heatmap */}
                  {labels.map((predictedLabel, colIndex) => {
                    const value = confusionMatrix[actualLabel][predictedLabel];
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
                            confusionMatrix
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

export default HeatMap;
