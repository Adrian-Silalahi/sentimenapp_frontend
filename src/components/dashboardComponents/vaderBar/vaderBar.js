import React from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

const VaderBar = () => {
  const neutralCount = 7916;
  const positiveCount = 15431;
  const negativeCount = 5089;

  const chartOptions = {
    chart: {
      type: "pie",
      height: "80%",
    },
    title: {
      text: "Distribusi Sentimen VADER",
      margin: 60,
    },
    tooltip: {
      pointFormat:
        "{series.name}: <b>{point.percentage:.1f}%</b> ({point.y} data)",
    },
    accessibility: {
      point: {
        valueSuffix: "%",
      },
    },
    plotOptions: {
      pie: {
        allowPointSelect: true,
        cursor: "pointer",
        dataLabels: {
          enabled: true,
          format: "<b>{point.name}</b>: {point.percentage:.1f} %",
          style: {
            color:
              (Highcharts.theme && Highcharts.theme.contrastTextColor) ||
              "black",
          },
        },
        showInLegend: true,
      },
    },
    series: [
      {
        name: "Sentimen",
        colorByPoint: true,
        data: [
          { name: "Netral", y: neutralCount },
          { name: "Positif", y: positiveCount },
          { name: "Negatif", y: negativeCount },
        ],
      },
    ],
    credits: {
      enabled: false,
    },
  };

  return (
    <div
      style={{
        margin: "20px",
        border: "1px solid #eee",
        padding: "20px",
        borderRadius: "5px",
        boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
      }}
    >
      <HighchartsReact highcharts={Highcharts} options={chartOptions} />
    </div>
  );
};

export default VaderBar;
