import SourceCard from "../sourceCard/sourceCard";
import { FaMediumM, FaYoutube } from "react-icons/fa";
import { RiTwitterXLine } from "react-icons/ri";
import "./sourceStats.scss";
import { GooglePlayIcon } from "../../atomComponents/googlePlayIcon";

const DataSourceStats = () => {
  const dataSources = [
    {
      platform: "Medium",
      icon: <FaMediumM />,
      dataCount: "400",
      language: "Inggris",
      yearRange: "2023-2024",
      iconColor: "text-black",
      progressColor: "bg-gray-700",
    },
    {
      platform: "X",
      icon: <RiTwitterXLine />,
      dataCount: "12,451",
      language: "Inggris",
      yearRange: "2023-2024",
      iconColor: "black",
      progressColor: "bg-blue-500",
    },
    {
      platform: "YouTube",
      icon: <FaYoutube />,
      dataCount: "9,177",
      language: "Inggris",
      yearRange: "2023-2024",
      iconColor: "text-red-700", // Warna ikon YouTube
      progressColor: "bg-red-600",
    },
    {
      platform: "Google Play Store",
      icon: <GooglePlayIcon width="43px" height="43px" />,
      dataCount: "15,000",
      language: "Inggris",
      yearRange: "2023-2024",
      iconColor: "text-pink-500",
      progressColor: "bg-pink-500",
    },
  ];

  return (
    <div className="data-stats-container">
      <h2 className="data-stats-title">Statistik Sumber Data Penelitian</h2>
      <div className="data-stats-cards-wrapper">
        {dataSources.map((source, index) => (
          <SourceCard
            key={index}
            platform={source.platform}
            icon={source.icon}
            dataCount={source.dataCount}
            language={source.language}
            yearRange={source.yearRange}
          />
        ))}
      </div>
    </div>
  );
};

export default DataSourceStats;
