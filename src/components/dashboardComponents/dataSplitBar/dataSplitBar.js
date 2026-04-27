import "./dataSplitBar.scss";
import React from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

const DataSplitBar = () => {
  const trainingSetCount = 22749;
  const validationSetCount = 2844;
  const testSetCount = 2843;

  const chartOptions = {
    chart: {
      type: "column",
      height: "80%",
    },
    title: {
      text: "Distribusi Dataset",
      margin: 60,
    },
    xAxis: {
      categories: ["Training Set", "Validation Set", "Test Set"],
      crosshair: true,
      labels: {
        style: {
          fontSize: "12px",
        },
      },
    },
    yAxis: {
      min: 0,
      title: {
        text: "Jumlah Data",
      },
      labels: {
        formatter: function () {
          // Mengubah angka besar menjadi format 'k' (misal 10000 menjadi 10k)
          if (this.value >= 1000) {
            return this.value / 1000 + "k";
          }
          return this.value;
        },
        style: {
          fontSize: "12px",
        },
      },
    },
    tooltip: {
      headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
      pointFormat:
        '<tr><td style="color:{series.color};padding:0">Jumlah: </td>' +
        '<td style="padding:0"><b>{point.y:,.0f} data</b></td></tr>', // Menampilkan angka dengan pemisah ribuan
      footerFormat: "</table>",
      shared: true,
      useHTML: true,
    },
    plotOptions: {
      column: {
        pointPadding: 0.2,
        borderWidth: 0,
        dataLabels: {
          enabled: true,
          format: "{point.y:,.0f}", // Menampilkan nilai data di atas setiap batang dengan pemisah ribuan
          style: {
            fontWeight: "bold",
          },
        },
      },
    },
    series: [
      {
        name: "Dataset",
        data: [
          {
            name: "Training Set",
            y: trainingSetCount,
            color: "#5470C6", // Warna biru
          },
          {
            name: "Validation Set",
            y: validationSetCount,
            color: "#91CC75", // Warna hijau
          },
          {
            name: "Test Set",
            y: testSetCount,
            color: "#FAC858", // Warna kuning
          },
        ],
        showInLegend: false,
      },
    ],
    credits: {
      enabled: false, // Menyembunyikan kredit Highcharts.com
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

export default DataSplitBar;
