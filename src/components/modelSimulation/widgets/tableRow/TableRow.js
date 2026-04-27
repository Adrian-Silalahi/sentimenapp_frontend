import "./tableRow.scss";
import { useSelector } from "react-redux"; // Dipertahankan untuk table_headers

const TableRow = ({
  index,
  style, // dari react-window
  rowData,
  rowHeight,
}) => {
  const { table_headers } = useSelector((state) => state.tableData);
  const dataNumber = index + 1;

  // Fungsi untuk mendapatkan kelas CSS spesifik untuk lebar kolom
  const getCellClass = (headerText) => {
    if (!headerText) return "";
    switch (headerText) {
      case "message":
      case "HTML element cleansing result":
      case "Normalize text result":
      case "Text preprocessing result":
      case "Data balancing result":
        return "cell-message";
      case "Actual label":
        return "cell-label";
      case "Prediction result":
        return "cell-predict";
      case "Confidence":
        return "cell-confidence";
      default:
        return "";
    }
  };

  return (
    <div
      style={{
        ...style, // style dari react-window
      }}
      className="table-row"
    >
      {/* Cell untuk Kolom "No" */}
      <div style={{ lineHeight: `${rowHeight}px` }} className="number-cell">
        {dataNumber}
      </div>

      {/* Cell untuk Kolom Data Asli */}
      {table_headers.map((header, cellIdx) => {
        const specificCellClass = getCellClass(header);

        if (specificCellClass === "cell-message") {
          return (
            <div
              key={cellIdx}
              style={{
                lineHeight: `${rowHeight}px`,
                whiteSpace: "pre",
                overflowX: "auto",
              }}
              className={`regular-cell `}
            >
              <div className={`${specificCellClass}`}>{rowData[cellIdx]}</div>
            </div>
          );
        } else {
          // Return elemen lain jika bukan "cell-message"
          return (
            <div
              key={cellIdx}
              style={{
                lineHeight: `${rowHeight}px`,
                whiteSpace: "pre",
                overflowX: "auto",
              }}
              className={`regular-cell ${specificCellClass}`}
            >
              {rowData[cellIdx]}
            </div>
          );
        }
      })}
    </div>
  );
};

export default TableRow;
