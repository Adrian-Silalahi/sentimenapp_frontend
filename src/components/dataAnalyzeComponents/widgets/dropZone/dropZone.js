import { useState, useRef } from "react";
import { useDispatch } from "react-redux";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import GetAppRoundedIcon from "@mui/icons-material/GetAppRounded";
import { convertBytesToReadableSize } from "../../../../utils/convertBytesToReadableSize";
import { validationFileChecks } from "../../../../utils/validationFileChecks";
import { readFileAndParseData } from "../../../../utils/readerFile";
import { validationDataChecks } from "../../../../utils/validationDataChecks";
import { setInfoFile, setRawData } from "../../../../redux/dataSlice";
import { setTableBody, setTableHeaders } from "../../../../redux/tableSlice";
import { Link } from "react-router-dom";

const DropZone = ({
  setIsLoadingUpload,
  setError,
  resetState,
  mode = "analysis",
}) => {
  const dispatch = useDispatch();
  const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5MB
  const ALLOWED_EXTENSIONS = [".xlsx", ".xls", ".csv"];

  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);
  const includeErrorReset = true;

  const handleFileUpload = async (file) => {
    const errorMessage = validationFileChecks(
      file,
      MAX_FILE_SIZE_BYTES,
      ALLOWED_EXTENSIONS,
    );
    if (errorMessage !== null) {
      setError(errorMessage);
      resetState(!includeErrorReset);
      return null;
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    resetState(includeErrorReset);

    dispatch(
      setInfoFile({
        name: file.name,
        size: convertBytesToReadableSize(file.size),
      }),
    );
    setIsLoadingUpload(true);

    const result = await readFileAndParseData(file);
    if (result.error) {
      setError(result.error);
      resetState(!includeErrorReset);
      setIsLoadingUpload(false);
      return null;
    }

    const validationResult = validationDataChecks(result, setError, resetState);
    if (validationResult !== null) {
      const { result } = validationResult;
      dispatch(setTableBody(result.tableData));
      dispatch(setTableHeaders(result.headers));
      dispatch(setRawData(result));
      setError("");
      setIsLoadingUpload(false);
    }
  };

  const handleDrop = (event) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(false);
    const file = event.dataTransfer.files[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (event) => {
    event.preventDefault();
    event.stopPropagation();
    const dropZone = event.currentTarget;
    const relatedTarget = event.relatedTarget;
    if (!relatedTarget || !dropZone.contains(relatedTarget)) {
      setIsDragging(false);
    }
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const handleSelectFileClick = () => {
    fileInputRef.current?.click();
  };

  const isSimulationMode = mode === "simulation";

  const themeConfig = {
    title: isSimulationMode
      ? "Model Creation Simulation"
      : "File-Based Sentiment Analysis",
    icon: isSimulationMode ? (
      <AutoAwesomeIcon className="w-12 h-12 mb-3" />
    ) : (
      <CloudUploadIcon className="w-12 h-12 mb-3" />
    ),
    mainText: isSimulationMode
      ? "Upload a dataset to start the simulation"
      : "Choose a file or drag it to this area",
    textColor: isSimulationMode
      ? "text-purple-600 dark:text-purple-400"
      : "text-blue-600 dark:text-blue-400",
    bgColor: isSimulationMode
      ? "bg-purple-50 dark:bg-purple-900/10"
      : "bg-blue-50 dark:bg-blue-900/10",
    hoverBgColor: isSimulationMode
      ? "hover:bg-purple-100 dark:hover:bg-purple-900/20"
      : "hover:bg-blue-100 dark:hover:bg-blue-900/20",
    borderColor: isSimulationMode
      ? "border-purple-300 dark:border-purple-700"
      : "border-blue-300 dark:border-blue-700",
    dragBorderColor: isSimulationMode ? "border-purple-500" : "border-blue-500",
    btnBgColor: isSimulationMode
      ? "bg-purple-600 hover:bg-purple-700"
      : "bg-blue-600 hover:bg-blue-700",
    btnOutlineColor: isSimulationMode
      ? "border-purple-200 text-purple-700 hover:bg-purple-50"
      : "border-blue-200 text-blue-700 hover:bg-blue-50",
    alertBg: isSimulationMode
      ? "bg-purple-50 dark:bg-purple-900/10 border-purple-200"
      : "bg-blue-50 dark:bg-blue-900/10 border-blue-200",
  };

  return (
    <div className="w-full flex flex-col gap-6 animate-in fade-in duration-500">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-50">
          {themeConfig.title}
        </h1>
        <p className="text-slate-600 dark:text-slate-400">
          Start the process by uploading the dataset you want to analyze.
        </p>
      </div>

      <div
        className={`relative w-full rounded-2xl border-2 border-dashed transition-all duration-200 ease-in-out p-8 md:p-12 flex flex-col items-center justify-center cursor-pointer overflow-hidden ${
          isDragging
            ? `${themeConfig.dragBorderColor} ${themeConfig.bgColor} scale-[1.02]`
            : `${themeConfig.borderColor} ${themeConfig.hoverBgColor} bg-white dark:bg-slate-900/50`
        }`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={handleSelectFileClick}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept={ALLOWED_EXTENSIONS.join(",")}
          className="hidden"
        />

        <div
          className={`transition-transform duration-300 ${isDragging ? "-translate-y-2 scale-110" : ""} ${themeConfig.textColor}`}
        >
          {themeConfig.icon}
        </div>

        <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-2 text-center">
          {themeConfig.mainText}
        </h3>

        <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 text-center max-w-md">
          Supports {ALLOWED_EXTENSIONS.join(", ")} formats up to a maximum limit
          of {convertBytesToReadableSize(MAX_FILE_SIZE_BYTES)}.
        </p>

        <button
          className={`px-6 py-2.5 rounded-lg border font-medium transition-colors duration-200 ${themeConfig.btnOutlineColor}`}
          onClick={(e) => {
            e.stopPropagation();
            handleSelectFileClick();
          }}
        >
          Browse File
        </button>

        {isDragging && (
          <div className="absolute inset-0 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm flex items-center justify-center">
            <h2 className={`text-2xl font-bold ${themeConfig.textColor}`}>
              Drop the file here...
            </h2>
          </div>
        )}
      </div>

      <div className="bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800 rounded-xl p-4 flex gap-3">
        <span className="material-symbols-outlined text-amber-500 mt-0.5">
          warning
        </span>
        <div>
          <h4 className="font-semibold text-amber-800 dark:text-amber-500 mb-1">
            Important Dataset Format!
          </h4>
          <p className="text-sm text-amber-700/80 dark:text-amber-400/80 leading-relaxed">
            Ensure your Excel or CSV file contains the data column to be
            processed with the header name <strong>"message"</strong> (all
            lowercase). Other columns will be ignored.
          </p>
        </div>
      </div>

      {/* Alternative Data Source */}
      <div
        className={`mt-2 border rounded-xl p-6 flex flex-col md:flex-row items-center justify-between gap-6 ${themeConfig.alertBg}`}
      >
        <div>
          <h4 className="font-semibold text-slate-800 dark:text-slate-200 mb-1">
            Don't have a dataset?
          </h4>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            You can extract review or post data directly from various platforms
            (Twitter, YouTube, Play Store).
          </p>
        </div>
        <Link
          to="/data-extraction"
          className={`flex-shrink-0 flex items-center gap-2 px-5 py-2.5 rounded-lg text-white font-medium shadow-sm transition-colors ${themeConfig.btnBgColor}`}
        >
          <GetAppRoundedIcon fontSize="small" />
          Extract Data
        </Link>
      </div>
    </div>
  );
};

export default DropZone;
