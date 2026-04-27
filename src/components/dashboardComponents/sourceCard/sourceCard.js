// src/components/DataSourceCard.js
import React from "react";
import { FaGlobeAmericas, FaCalendarAlt } from "react-icons/fa";
import "./sourceCard.scss"; // Impor SCSS untuk komponen ini

const SourceCard = ({ platform, icon, dataCount, language, yearRange }) => {
  const formatNumber = (num) =>
    num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

  // Tambahkan kelas berdasarkan platform untuk styling spesifik jika perlu
  const platformClass = platform.toLowerCase().replace(/\s+/g, "-"); // misal "x-(twitter)" jadi "x-twitter"

  return (
    <div className={`data-card data-card--${platformClass}`}>
      <div className="data-card__header">
        <div className={`data-card__icon data-card__icon--${platformClass}`}>
          {icon}
        </div>
        <div className="data-card__summary">
          <div className="data-card__count">{formatNumber(dataCount)}</div>
          <div className="data-card__label">Total Data</div>
        </div>
      </div>
      <hr className="data-card__separator" />
      <div className="data-card__details">
        <div className="data-card__detail-item">
          <FaGlobeAmericas className="data-card__detail-icon" />
          <span>Bahasa: {language}</span>
        </div>
        <div className="data-card__detail-item">
          <FaCalendarAlt className="data-card__detail-icon" />
          <span>Rentang Tahun: {yearRange}</span>
        </div>
        <div className="data-card__title">
          {`Sumber data: `}
          <span className="data-card__source_platform">{platform}</span>
        </div>
      </div>
    </div>
  );
};

export default SourceCard;
