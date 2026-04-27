import { useSelector } from "react-redux";
import "./tableHeaders.scss";

const TableHeader = ({ theme = "blue" }) => {
  const { table_headers } = useSelector((state) => state.tableData);

  const getBackgroundColor = () => {
    switch (theme) {
      case "green":
        return "#059669"; // Emerald 600
      case "purple":
        return "#7c3aed"; // Violet 600
      case "blue":
      default:
        return "#1976d2"; // MUI Blue
    }
  };

  const getHeaderCellClass = (headerText) => {
    if (!headerText) return "";
    switch (headerText) {
      case "message":
      case "HTML element cleansing result":
      case "Normalize text result":
      case "Cleaning text result":
      case "Data balancing result":
        return "header-cell-message";
      case "Actual label":
        return "header-cell-label";
      case "Prediction result":
        return "header-cell-predict";
      case "Confidence":
        return "header-cell-confidence";
      default:
        return "";
    }
  };

  return (
    <div
      className="table-header"
      style={{ backgroundColor: getBackgroundColor(), color: "#fff" }}
    >
      <div className="number-header-cell">No</div>
      {table_headers.map((header, idx) => {
        const specificClass = getHeaderCellClass(header);
        return (
          <div key={idx} className={`regular-header-cell ${specificClass}`}>
            {header}
          </div>
        );
      })}
    </div>
  );
};

export default TableHeader;
