import React, { useState, useCallback, useEffect } from "react";
import { Link } from "react-router-dom";
import { useDropzone } from "react-dropzone";
import * as XLSX from "xlsx";
import Papa from "papaparse";
import { useDispatch, useSelector } from "react-redux";
import { setTableBody, setTableHeaders } from "../../../redux/tableSlice";
import PrepoTable from "../../../components/preprocessingComponents/PrepoTable/prepoTable";
import { prepoProcessingData } from "../../../utils/prepoProcessingData";
import * as api from "../../../api/pipelinePreprocess";
import LoadingSpinner from "../../../components/dataAnalyzeComponents/widgets/loadingSpinner/loadingSpinner";

const VaderLabeling: React.FC = () => {
  const preproStep = 3;
  const dispatch = useDispatch();
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [isProcessComplete, setIsProcessComplete] = useState(false);

  // @ts-ignore
  const { table_body } = useSelector((state: any) => state.tableData);
  // @ts-ignore
  const { download_file_names } = useSelector(
    (state: any) => state.dataProcessing,
  );

  useEffect(() => {
    dispatch(setTableHeaders([]));
    dispatch(setTableBody([]));
    return () => {
      dispatch(setTableHeaders([]));
      dispatch(setTableBody([]));
    };
  }, [dispatch]);

  const parseFile = (file: File) => {
    setError("");
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        let headers: string[] = [];
        let rows: any[] = [];

        if (file.name.endsWith(".csv")) {
          // @ts-ignore
          const result = Papa.parse(data, { header: true });
          headers = result.meta.fields || [];
          rows = result.data.map((row: any) =>
            headers.map((header) => row[header]),
          );
        } else {
          // @ts-ignore
          const workbook = XLSX.read(data, { type: "binary" });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          const json: any[] = XLSX.utils.sheet_to_json(worksheet, {
            header: 1,
          });

          if (json.length > 0) {
            headers = json[0];
            rows = json.slice(1);
          }
        }

        dispatch(setTableHeaders(headers));
        dispatch(setTableBody(rows));
      } catch (err) {
        console.error("Error parsing file:", err);
        setError(
          "Failed to process the file. Please ensure the file format is correct.",
        );
        dispatch(setTableHeaders([]));
        dispatch(setTableBody([]));
      }
    };

    reader.onerror = () => {
      setError("Failed to read the file.");
    };

    if (file.name.endsWith(".csv")) {
      reader.readAsText(file);
    } else {
      reader.readAsBinaryString(file);
    }
  };

  const onDrop = useCallback((acceptedFiles: File[]) => {
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

  const handleReupload = () => {
    dispatch(setTableBody([]));
    dispatch(setTableHeaders([]));
    setIsProcessComplete(false);
    setError("");
  };

  const handleDownloadDataset = async () => {
    try {
      const indexStep = preproStep - 1;
      const blob = await api.downloadPreprocessedFile(
        download_file_names[indexStep],
      );
      const downloadLink = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = downloadLink;
      a.download = download_file_names[indexStep];
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(downloadLink);
    } catch (error) {
      console.error("Download error:", error);
    }
  };

  const handleProcess = () => {
    prepoProcessingData(
      preproStep,
      dispatch,
      table_body,
      setIsLoading,
      setIsProcessComplete,
      download_file_names,
    );
  };

  return (
    <div className="p-4 md:p-5 lg:p-6 max-w-container-max mx-auto w-full h-full justify-center flex flex-col gap-4 animate-in fade-in duration-500">
      <div className="flex flex-col gap-2 max-w-3xl">
        <h1 className="font-headline-md text-headline-md text-slate-900 dark:text-slate-50">
          VADER Labeling
        </h1>
        <p className="font-body-md text-body-md text-slate-600 dark:text-slate-400">
          An automatic rule-based sentiment labeling process using the VADER
          (Valence Aware Dictionary and sEntiment Reasoner) lexicon,
          specifically designed for social media language.
        </p>
      </div>

      {table_body.length > 0 ? (
        <div className="flex flex-col gap-4 mt-2">
          <div className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
            {isLoading ? (
              <div className="py-12">
                <LoadingSpinner />
              </div>
            ) : (
              <PrepoTable preproStep={preproStep} />
            )}
          </div>

          <div className="flex items-center justify-between">
            <button
              onClick={handleReupload}
              className="px-4 py-2 flex items-center gap-2 text-slate-600 hover:text-emerald-600 font-medium transition-colors"
            >
              <span className="material-symbols-outlined text-[20px]">
                replay
              </span>
              Re-upload
            </button>

            <div className="flex gap-3">
              {isProcessComplete ? (
                <button
                  onClick={handleDownloadDataset}
                  className="px-5 py-2.5 border border-emerald-600 text-emerald-700 hover:bg-emerald-50 rounded-lg font-bold text-sm transition-colors flex items-center gap-2"
                >
                  <span className="material-symbols-outlined text-[20px]">
                    cloud_download
                  </span>
                  Download Data
                </button>
              ) : (
                <button
                  onClick={handleProcess}
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold text-sm transition-colors shadow-sm"
                  disabled={isLoading}
                >
                  Process Data
                </button>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-2">
          {/* Left Column (Upload Area) */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            {/* Upload Card */}
            <div className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm">
              <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center transition-colors duration-200 cursor-pointer ${
                  isDragActive
                    ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-900/10"
                    : "border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800"
                }`}
              >
                <input {...getInputProps()} />
                <div className="w-12 h-12 bg-emerald-500 text-white rounded-full flex items-center justify-center mb-4 shadow-md">
                  <span className="material-symbols-outlined text-2xl">
                    cloud_upload
                  </span>
                </div>
                <h3 className="font-headline-md text-headline-md text-slate-900 dark:text-slate-50 mb-2">
                  Upload Your Dataset
                </h3>
                <p className="font-body-md text-body-md text-slate-500 dark:text-slate-400 mb-4 text-center">
                  Drag & drop your file here or click to browse.
                </p>

                <div className="flex items-center gap-3 mb-6">
                  <span className="px-4 py-1.5 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-full text-[10px] font-bold uppercase tracking-widest">
                    CSV
                  </span>
                  <span className="px-4 py-1.5 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-full text-[10px] font-bold uppercase tracking-widest">
                    XLS
                  </span>
                  <span className="px-4 py-1.5 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-full text-[10px] font-bold uppercase tracking-widest">
                    XLSX
                  </span>
                </div>

                <button className="px-6 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg font-bold text-sm transition-colors shadow-sm pointer-events-none">
                  Browse File
                </button>
              </div>
              {error && (
                <p className="text-red-500 text-sm mt-3 text-center">{error}</p>
              )}
            </div>

            {/* Alternative Card */}
            <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-5 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined font-bold text-xl">
                    data_object
                  </span>
                </div>
                <div>
                  <h4 className="font-headline-sm text-headline-sm text-slate-900 dark:text-slate-50 mb-1">
                    Don't have a dataset?
                  </h4>
                  <p className="font-body-sm text-body-sm text-slate-600 dark:text-slate-400">
                    Extract data directly from sources before labeling.
                  </p>
                </div>
              </div>
              <Link
                to="/data-extraction"
                className="px-5 py-2.5 border border-slate-300 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-lg font-bold text-sm transition-colors whitespace-nowrap flex items-center gap-2"
              >
                Go to Data Extraction
                <span className="material-symbols-outlined text-sm">
                  arrow_forward
                </span>
              </Link>
            </div>
          </div>

          {/* Right Column (Normalization Scope) */}
          <div className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm h-fit">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-6 h-6 bg-emerald-500 text-white rounded-full flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-[14px]">
                  info
                </span>
              </div>
              <h3 className="font-headline-sm text-headline-sm text-slate-900 dark:text-slate-50">
                Labeling Mechanism
              </h3>
            </div>

            <p className="font-body-sm text-body-sm text-slate-600 dark:text-slate-400 mb-4">
              This process will analyze the text and generate the following
              attributes:
            </p>

            <div className="flex flex-col gap-3">
              {/* Item 1 */}
              <div className="flex items-start gap-4">
                <span className="material-symbols-outlined text-emerald-600 mt-0.5">
                  speed
                </span>
                <div>
                  <h5 className="font-bold text-sm text-slate-900 dark:text-slate-50 mb-0.5">
                    Polarity Score
                  </h5>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                    Calculates the compound score between -1 and +1.
                  </p>
                </div>
              </div>

              {/* Item 2 */}
              <div className="flex items-start gap-4">
                <span className="material-symbols-outlined text-emerald-600 mt-0.5">
                  category
                </span>
                <div>
                  <h5 className="font-bold text-sm text-slate-900 dark:text-slate-50 mb-0.5">
                    Classification
                  </h5>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                    Categorizes text into Positive, Neutral, and Negative.
                  </p>
                </div>
              </div>

              {/* Item 3 */}
              <div className="flex items-start gap-4">
                <span className="material-symbols-outlined text-emerald-600 mt-0.5">
                  trending_up
                </span>
                <div>
                  <h5 className="font-bold text-sm text-slate-900 dark:text-slate-50 mb-0.5">
                    Intensity Detection
                  </h5>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                    Takes into account word capitalization and supporting
                    punctuation.
                  </p>
                </div>
              </div>

              {/* Item 4 */}
              <div className="flex items-start gap-4">
                <span className="material-symbols-outlined text-emerald-600 mt-0.5">
                  mood
                </span>
                <div>
                  <h5 className="font-bold text-sm text-slate-900 dark:text-slate-50 mb-0.5">
                    Emoticon Handling
                  </h5>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                    Understands the sentiment implied by social media emoticons.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VaderLabeling;
