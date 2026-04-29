import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import "./tableHeaders.scss";

const TableHeader = () => {
  const { table_headers } = useSelector((state) => state.tableData);
  const location = useLocation();
  const isSimulator = location.pathname.includes("/roberta-builder-simulator");

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
      style={{ 
        backgroundColor: isSimulator ? "#630ed4" : "#ededed", 
        color: isSimulator ? "#ffffff" : "#555" 
      }}
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
