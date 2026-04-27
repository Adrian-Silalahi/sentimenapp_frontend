import React from "react";

const getColor = (label) => {
  switch (label) {
    case "Positive":
      return "green";
    case "Neutral":
      return "gray";
    case "Negative":
      return "red";
  }
};

const StatusBullet = ({ label, count }) => {
  const bulletStyle = {
    display: "inline-block",
    width: "10px",
    height: "10px",
    borderRadius: "50%",
    backgroundColor: getColor(label),
    marginRight: "8px",
  };

  return (
    <div style={{ display: "flex", alignItems: "center" }}>
      <span style={bulletStyle}></span>
      <div style={{ fontWeight: "500", alignItems: "start", fontSize: "14px" }}>
        {label}: {count} entries
      </div>
    </div>
  );
};

export default StatusBullet;
