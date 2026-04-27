import React from "react";
import {
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Box,
  Chip,
} from "@mui/material";

import "./matriksDetail.scss";

const DataBar = ({ value }) => {
  return (
    <Box className="data-bar-container">
      <Box className="data-bar-value">{value}%</Box>
    </Box>
  );
};

const MatriksDetail = ({ labels, classMetrics, labelColors }) => {
  return (
    <Grid item className="metrics-detail-container">
      <Typography variant="h6" className="metrics-title">
        Evaluation Metrics
      </Typography>
      <TableContainer
        component={Paper}
        elevation={0} // elevation kita atur via box-shadow di SCSS
        className="metrics-table-container"
      >
        <Table>
          <TableHead>
            <TableRow className="table-header-row">
              <TableCell className="metrics-table-header-cell">Class</TableCell>
              <TableCell align="center" className="metrics-table-header-cell">
                Count
              </TableCell>
              <TableCell className="metrics-table-header-cell">
                Precision
              </TableCell>
              <TableCell className="metrics-table-header-cell">
                Recall
              </TableCell>
              <TableCell className="metrics-table-header-cell">
                F1-Score
              </TableCell>
              <TableCell className="metrics-table-header-cell">
                Accuracy
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {labels.map((label) => {
              const metrics = classMetrics[label];
              const precision = (metrics.precision * 100).toFixed(0);
              const recall = (metrics.recall * 100).toFixed(0);
              const f1Score = (metrics.f1Score * 100).toFixed(0);
              const accuracy = (metrics.accuracy * 100).toFixed(0);

              return (
                <TableRow key={label} className="metrics-table-row">
                  <TableCell component="th" scope="row">
                    <Chip
                      label={label}
                      color={labelColors[label] || "default"}
                      className="label-chip"
                    />
                  </TableCell>
                  <TableCell align="center" className="count-cell">
                    {metrics.count}
                  </TableCell>
                  <TableCell>
                    <DataBar value={precision} />
                  </TableCell>
                  <TableCell>
                    <DataBar value={recall} />
                  </TableCell>
                  <TableCell>
                    <DataBar value={f1Score} />
                  </TableCell>
                  <TableCell>
                    <DataBar value={accuracy} />
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Grid>
  );
};

export default MatriksDetail;
