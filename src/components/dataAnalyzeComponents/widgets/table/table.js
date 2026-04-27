import AutoSizer from "react-virtualized-auto-sizer";
import { FixedSizeList as List } from "react-window";
import "./table.scss";
import { useSelector } from "react-redux";
import TableRow from "../tableRow/TableRow";
import TableHeader from "../tableHeaders/TableHeaders";
import { Typography } from "@mui/material";

const Table = ({ isLoading }) => {
  const { table_body } = useSelector((state) => state.tableData);
  const { activeStep, completedList } = useSelector(
    (state) => state.stepProcessing
  );

  const ROW_HEIGHT = 35;
  // Preview mode (step 0) shows 8 rows, process mode shows 10
  const ROW_COUNT = activeStep >= 1 ? 10 : 8;
  const maxProcessHeight = ROW_HEIGHT * ROW_COUNT;

  const MAX_BODY_HEIGHT = maxProcessHeight;
  const numRows = table_body?.length || 0;

  // Hitung tinggi total konten berdasarkan jumlah baris
  const calculatedBodyHeight = numRows > 0 ? numRows * ROW_HEIGHT : 0;

  // Final height untuk container body, dibatasi oleh maksimum
  const bodyContainerHeight = Math.min(calculatedBodyHeight, MAX_BODY_HEIGHT);

  const RowRenderer = ({ index, style }) => (
    <TableRow
      index={index}
      style={style}
      rowData={table_body[index]}
      rowHeight={ROW_HEIGHT}
    />
  );

  if (isLoading) {
    return null;
  }

  return (
    <>
      <div class="entries-data-count">
        <div class="left">
          <Typography
            gutterBottom
            className="table-title"
            sx={{ fontWeight: "bold" }}
          >
            Count : {numRows} entries
          </Typography>
        </div>
      </div>
      <div className="table-container">
        <TableHeader />

        <div style={{ height: `${bodyContainerHeight}px`, width: "100%" }}>
          <AutoSizer>
            {({ height, width }) => (
              <List
                height={height}
                width={width}
                itemCount={numRows}
                itemSize={ROW_HEIGHT}
                scrollbar
              >
                {RowRenderer}
              </List>
            )}
          </AutoSizer>
        </div>
      </div>
    </>
  );
};

export default Table;
