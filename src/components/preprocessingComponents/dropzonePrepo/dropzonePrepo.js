import React, { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { useNavigate } from "react-router-dom"; // Gunakan Link jika preferensi
import * as XLSX from "xlsx";
import Papa from "papaparse";
import { FiUploadCloud, FiDatabase } from "react-icons/fi";
import "./dropzonePrepo.scss";
import { useDispatch } from "react-redux";
import { setTableBody, setTableHeaders } from "../../../redux/tableSlice";
import LoadingSpinner from "../../dataAnalyzeComponents/widgets/loadingSpinner/loadingSpinner";
import PrepoTable from "../PrepoTable/prepoTable";

const DropzonePrepo = ({ isLoading, tableBody, preproStep }) => {
  const [tableData, setTableData] = useState(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const parseFile = (file) => {
    setError("");
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = e.target.result;
        let headers = [];
        let rows = [];

        if (file.name.endsWith(".csv")) {
          // Parsing CSV
          const result = Papa.parse(data, { header: true });
          headers = result.meta.fields;
          rows = result.data.map((row) => headers.map((header) => row[header]));
        } else {
          // Parsing Excel (.xlsx, .xls)
          const workbook = XLSX.read(data, { type: "binary" });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          const json = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

          if (json.length > 0) {
            headers = json[0];
            rows = json.slice(1);
          }
        }

        // Membatasi tampilan data untuk performa
        setTableData({ headers, rows: rows.slice(0, 10) }); // Tampilkan 10 baris pertama
        dispatch(setTableHeaders(headers));
        dispatch(setTableBody(rows));
      } catch (err) {
        console.error("Error parsing file:", err);
        setError("Gagal memproses file. Pastikan format file benar.");
        setTableData(null);
        dispatch(setTableHeaders([]));
        dispatch(setTableBody([]));
      }
    };

    reader.onerror = () => {
      setError("Gagal membaca file.");
      setTableData(null);
    };

    if (file.name.endsWith(".csv")) {
      reader.readAsText(file);
    } else {
      reader.readAsBinaryString(file);
    }
  };

  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      parseFile(acceptedFiles[0]);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "text/csv": [".csv"],
      "application/vnd.ms-excel": [".xls"],
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [
        ".xlsx",
      ],
    },
    maxFiles: 1,
  });

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <>
      {!tableBody.length > 0 ? (
        // Tampilan Awal sebelum file di-upload
        <div className="main-container">
          <div className="upload-header">
            <span className="upload-title">Upload Your Dataset</span>
          </div>
          <div
            {...getRootProps({
              className: `dropzone-area ${isDragActive ? "active" : ""}`,
            })}
          >
            <input {...getInputProps()} />
            <FiUploadCloud size={60} className="icon" />
            <p>
              <b>Drag & drop files here</b>, or click to select a file
            </p>
            <em>(Supports .csv, .xls, .xlsx)</em>
          </div>
          {error && <p className="error-message">{error}</p>}
          <div className="alternative-action">
            <FiDatabase size={24} />
            <div className="action-text">
              <p>Don't have a dataset?</p>
              <span>
                {" "}
                You can extract data directly from platforms like YouTube, Play
                Store, or Twitter!
              </span>
            </div>
            <button
              onClick={() => navigate("/data-extraction")}
              className="action-button"
            >
              Go to Data Extraction
            </button>
          </div>
        </div>
      ) : (
        !isLoading && <PrepoTable preproStep={preproStep} />
      )}
    </>
  );
};

export default DropzonePrepo;
