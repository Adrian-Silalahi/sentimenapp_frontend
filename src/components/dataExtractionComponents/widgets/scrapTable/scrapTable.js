import React, { useCallback } from "react";
import { FixedSizeList as List } from "react-window";
import AutoSizer from "react-virtualized-auto-sizer";
import { Box, TableHead, TableRow, TableCell } from "@mui/material";

const ScrapTable = ({ data }) => {
  const headers = ["no", "message"];
  const ROW_HEIGHT = 40;
  const MAX_BODY_HEIGHT = 395;

  const renderRow = useCallback(
    ({ index, style }) => {
      const item = data[index];
      return (
        <TableRow component="div" style={style} className="table-row">
          {/* No cell */}
          <TableCell key="no" component="div" className="table-cell no">
            <div className="no-text">{index + 1}</div>
          </TableCell>

          {/* message cell */}
          <TableCell
            key="message"
            component="div"
            className="table-cell message"
          >
            <div className="message-text">{item}</div>
          </TableCell>
        </TableRow>
      );
    },
    [data]
  );
  return (
    <>
      {/* Table Header */}
      <TableHead component="div" stickyHeader className="table-header-wrapper">
        {headers.map((header) => (
          <TableCell
            key={header}
            component="div"
            className={`table-header-cell ${header}`}
          >
            {header === "no" ? "No" : "message"}
          </TableCell>
        ))}
      </TableHead>
      <Box className="table-container">
        <AutoSizer disableHeight>
          {({ width }) => (
            <List
              height={Math.min(data.length * ROW_HEIGHT, MAX_BODY_HEIGHT)}
              itemCount={data.length}
              itemSize={ROW_HEIGHT}
              width={width}
              className="table-list"
            >
              {renderRow}
            </List>
          )}
        </AutoSizer>
      </Box>
    </>
  );
};

export default ScrapTable;
