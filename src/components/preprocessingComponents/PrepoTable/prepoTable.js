import AutoSizer from "react-virtualized-auto-sizer";
import { FixedSizeList as List } from "react-window";
import "./prepoTable.scss";
import { useSelector } from "react-redux";
import { Typography } from "@mui/material";
import { useEffect, useState } from "react";
import TableRow from "../../dataAnalyzeComponents/widgets/tableRow/TableRow";
import TableHeader from "../../dataAnalyzeComponents/widgets/tableHeaders/TableHeaders";
import StatusBullet from "../../../utils/statusBullet";
import { countSentiments } from "../../../utils/countSentiments";

const PrepoTable = ({ preproStep }) => {
  const { table_body } = useSelector((state) => state.tableData);

  const { vader_label, data_balance } = useSelector(
    (state) => state.dataProcessing,
  );
  const { activeStep, completedList } = useSelector(
    (state) => state.stepProcessing,
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
  const ROW_COUNT = 10;
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

  const data_label = table_body.map((item) => item[1]);

  const getCount = () => {
    const labelCount = countSentiments(data_label, setLabelCount);
    return labelCount;
  };

  return (
    <>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 mt-2 px-1">
        <div className="flex-shrink-0">
          <Typography
            className="table-title"
            sx={{ fontWeight: "bold", margin: 0 }}
          >
            Count : {numRows} entries
          </Typography>
        </div>

        {preproStep === 5 && data_label[0] !== undefined && (
          <div className="flex flex-wrap items-center gap-3 sm:gap-6 bg-slate-50 dark:bg-slate-800/50 p-2 sm:p-0 rounded-lg sm:bg-transparent sm:dark:bg-transparent">
            {Object.entries(labelCount).map(([label, count]) => {
              return <StatusBullet key={label} label={label} count={count} />;
            })}
          </div>
        )}
      </div>

      <div className="table-container">
        <TableHeader theme="green" />

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

export default PrepoTable;
