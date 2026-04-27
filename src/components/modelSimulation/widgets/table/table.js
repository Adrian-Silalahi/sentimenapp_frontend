import AutoSizer from "react-virtualized-auto-sizer";
import { FixedSizeList as List } from "react-window";
import "./table.scss";
import { useSelector } from "react-redux";
import TableRow from "../tableRow/TableRow";
import TableHeader from "../tableHeaders/TableHeaders";
import { Typography } from "@mui/material";
import StatusBullet from "../../../../utils/statusBullet";
import { countSentiments } from "../../../../utils/countSentiments";
import { useEffect, useState } from "react";

const Table = ({ isLoading }) => {
  const { table_body } = useSelector((state) => state.tableData);
  const { vader_label, data_balance } = useSelector(
    (state) => state.dataProcessing
  );
  const { activeStep, completedList } = useSelector(
    (state) => state.stepProcessing
  );
  const [labelCount, setLabelCount] = useState({
    Positive: 0,
    Neutral: 0,
    Negative: 0,
  });

  useEffect(() => {
    getCount();
  }, [activeStep, vader_label, data_balance]);

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

  const isVaderComplete = completedList[2];
  // const isBalancingComplete = completedList[4];

  const RowRenderer = ({ index, style }) => (
    <TableRow
      index={index}
      style={style}
      rowData={table_body[index]}
      rowHeight={ROW_HEIGHT}
    />
  );

  const flattened_vader_label = vader_label.map((item) => item);
  const flattened_balance_label = data_balance.map((item) => item[1]);

  const getCount = () => {
    if (activeStep === 3 && vader_label.length > 0) {
      const labelCount = countSentiments(flattened_vader_label, setLabelCount);
      return labelCount;
    } else if (activeStep >= 4 && data_balance.length > 0) {
      const labelCount = countSentiments(
        flattened_balance_label,
        setLabelCount
      );
      return labelCount;
    }
  };

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

        {activeStep >= 3 && isVaderComplete && (
          <div class="right">
            {Object.entries(labelCount).map(([label, count]) => {
              return <StatusBullet label={label} count={count} />;
            })}
          </div>
        )}
      </div>

      <div className="table-container">
        <TableHeader theme="purple" />

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
