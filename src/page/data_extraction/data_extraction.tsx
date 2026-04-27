import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { setInfoFile, setRawData } from "../../redux/dataSlice";
import { setTableBody, setTableHeaders } from "../../redux/tableSlice";
import { convertBytesToReadableSize } from "../../utils/convertBytesToReadableSize";
import * as api from "../../api/scrapeData";
import LoadingScrape from "../../components/dataExtractionComponents/widgets/loadingScrape/loadingScrape";
import PopUpAlert from "../../components/dataExtractionComponents/widgets/popUpAlert/popUpAlert";
import ErrorAlert from "../../components/dataExtractionComponents/widgets/errorAlert/errorAlert";
import { Link, useNavigate } from "react-router-dom";

const DataExtraction: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const convertToArrayOfArray = (data: any[]) => {
    return data.map((item) => [
      typeof item === "string"
        ? item
        : item.message ||
          item.text ||
          item.tweet ||
          item.content ||
          item.textOriginal ||
          "-",
    ]);
  };

  const handleGoToAnalyzeData = () => {
    const arrayOfArrayData = convertToArrayOfArray(scrapedData);
    dispatch(setRawData({ headers: ["message"], tableData: arrayOfArrayData }));
    dispatch(setTableHeaders(["message"]));
    dispatch(setTableBody(arrayOfArrayData));
    navigate("/file-based-analysis?from=data-extraction");
  };

  const handleGoToFineTune = () => {
    const arrayOfArrayData = convertToArrayOfArray(scrapedData);
    dispatch(setRawData({ headers: ["message"], tableData: arrayOfArrayData }));
    dispatch(setTableHeaders(["message"]));
    dispatch(setTableBody(arrayOfArrayData));
    navigate("/roberta-builder-simulator?from=data-extraction");
  };
  const [selectedPlatform, setSelectedPlatform] = useState<
    "twitter" | "youtube" | "playstore" | ""
  >("twitter");

  // States based on existing logic
  const [playstoreLink, setPlaystoreLink] = useState("");
  const [playstoreLimit, setPlaystoreLimit] = useState(100);
  const [youtubeLink, setYoutubeLink] = useState("");
  const [youtubeLimit, setYoutubeLimit] = useState(100);
  const [twitterKeyword, setTwitterKeyword] = useState("Jokowi");
  const [twitterLimit, setTwitterLimit] = useState(100);
  const [twitterStartDate, setTwitterStartDate] = useState("");
  const [twitterEndDate, setTwitterEndDate] = useState("");
  const [twitterLanguage, setTwitterLanguage] = useState("id");

  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState({ message: "", type: "" });
  const [scrapedData, setScrapedData] = useState<any[]>([]);
  const [downloadFileName, setDownloadFileName] = useState("");
  const [isPopUp, setIsPopUp] = useState(false);

  // Pagination for Results
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const handlePlatformChange = (
    platform: "twitter" | "youtube" | "playstore",
  ) => {
    setSelectedPlatform(platform);
    // Reset inputs and data
    setStatusMessage({ message: "", type: "" });
    setScrapedData([]);
    setDownloadFileName("");
  };

  const handleClosePopUp = () => setIsPopUp(false);

  const handleScrape = async () => {
    let scrapeApiResponse;
    try {
      setLoading(true);
      setScrapedData([]);
      setDownloadFileName("");
      setStatusMessage({ message: "", type: "" });

      switch (selectedPlatform) {
        case "youtube":
          if (!youtubeLink.trim())
            throw new Error("Please enter the YouTube video link.");
          if (youtubeLimit <= 0)
            throw new Error("Count must be greater than 0.");
          scrapeApiResponse = await api.scrapeYoutubeComments(
            youtubeLink,
            youtubeLimit,
          );
          break;
        case "playstore":
          if (!playstoreLink.trim())
            throw new Error("Please enter the Play Store app link.");
          if (playstoreLimit <= 0)
            throw new Error("Count must be greater than 0.");
          scrapeApiResponse = await api.scrapePlaystoreReviews(
            playstoreLink,
            playstoreLimit,
          );
          break;
        case "twitter":
          if (!twitterKeyword.trim())
            throw new Error("Please enter a Twitter search keyword.");
          if (twitterLimit <= 0)
            throw new Error("Count must be greater than 0.");
          if (
            twitterStartDate &&
            twitterEndDate &&
            new Date(twitterStartDate) > new Date(twitterEndDate)
          ) {
            throw new Error("Start date cannot be after end date.");
          }
          let searchKeywordBuilder = twitterKeyword;
          if (twitterStartDate)
            searchKeywordBuilder += ` since:${twitterStartDate}`;
          if (twitterEndDate)
            searchKeywordBuilder += ` until:${twitterEndDate}`;
          if (twitterLanguage)
            searchKeywordBuilder += ` lang:${twitterLanguage}`;

          scrapeApiResponse = await api.scrapeTwitterTweets(
            searchKeywordBuilder,
            twitterLimit,
          );
          break;
        default:
          throw new Error("Invalid platform selected.");
      }

      setScrapedData(scrapeApiResponse.comments);
      setDownloadFileName(scrapeApiResponse.download_file_name);
      dispatch(
        setInfoFile({
          name: scrapeApiResponse.download_file_name,
          size: convertBytesToReadableSize(scrapeApiResponse.size_file),
        }),
      );
    } catch (error: any) {
      console.error(
        `Error during scraping process for ${selectedPlatform}:`,
        error,
      );
      setStatusMessage({
        message: `Error: ${error.message || "Unknown error"}`,
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadDataset = async () => {
    if (!downloadFileName) {
      setStatusMessage({
        message: "No dataset available to download.",
        type: "error",
      });
      return;
    }
    try {
      setLoading(true);
      setStatusMessage({ message: "", type: "" });
      const folderName =
        selectedPlatform === "playstore" || selectedPlatform === "youtube"
          ? "temp-file"
          : "tweets-data";
      const blob = await api.downloadScrapedFile(folderName, downloadFileName);
      const downloadLink = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = downloadLink;
      a.download = downloadFileName;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(downloadLink);
      setIsPopUp(true);
    } catch (error: any) {
      setStatusMessage({
        message: `Download error: ${error.message}`,
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  // Pagination logic
  const totalPages = Math.ceil(scrapedData.length / itemsPerPage);
  const paginatedData = scrapedData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  const renderPlatformSelector = (
    platform: "twitter" | "youtube" | "playstore",
    iconContent: React.ReactNode,
    name: string,
  ) => {
    const isSelected = selectedPlatform === platform;
    return (
      <div
        onClick={() => handlePlatformChange(platform)}
        className={`relative border rounded-lg cursor-pointer transition-all flex flex-col items-center justify-center gap-2 group p-2 ${
          isSelected
            ? "bg-emerald-50 border-emerald-500 border-2 hover:shadow-md"
            : "bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50 grayscale hover:grayscale-0"
        }`}
      >
        {isSelected && (
          <div className="absolute top-2 right-2 bg-emerald-500 text-white rounded-full w-5 h-5 flex items-center justify-center">
            <span
              className="material-symbols-outlined text-[14px]"
              style={{ fontVariationSettings: "'wght' 600" }}
            >
              check
            </span>
          </div>
        )}
        {iconContent}
        <span
          className={`font-body-sm text-body-sm font-semibold ${isSelected ? "text-emerald-800" : "text-slate-500 group-hover:text-slate-700"}`}
        >
          {name}
        </span>
      </div>
    );
  };

  return (
    <>
      <main className="flex-1 p-4 md:p-md lg:p-lg max-w-container-max mx-auto w-full items-center flex">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-gutter">
          {/* Left Column: Extraction Form */}
          <div className="lg:col-span-1 flex flex-col gap-md">
            <div className="bg-surface rounded-xl p-md border border-outline-variant/30 shadow-sm h-full flex flex-col">
              <h3 className="font-label-bold text-label-bold text-on-surface-variant mb-sm uppercase">
                Select platform
              </h3>
              <div className="grid gap-sm mb-md grid-cols-3 gap-2">
                {renderPlatformSelector(
                  "twitter",
                  <div className="w-10 h-10 bg-black text-white rounded-full flex items-center justify-center font-bold text-xl">
                    𝕏
                  </div>,
                  "Twitter",
                )}
                {renderPlatformSelector(
                  "youtube",
                  <div className="w-10 h-10 bg-red-600 text-white rounded-full flex items-center justify-center font-bold text-xl">
                    <span className="material-symbols-outlined">
                      play_circle
                    </span>
                  </div>,
                  "YouTube",
                )}
                {renderPlatformSelector(
                  "playstore",
                  <div className="w-10 h-10 bg-white border border-slate-100 rounded-full flex items-center justify-center overflow-hidden shadow-sm">
                    <svg
                      className="w-6 h-6"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M3 20.5V3.5C3 2.91 3.34 2.39 3.84 2.15L13.69 12L3.84 21.85C3.34 21.61 3 21.09 3 20.5Z"
                        fill="#4CAF50"
                      ></path>
                      <path
                        d="M16.97 15.28L13.69 12L16.97 8.72L20.67 10.83C21.73 11.44 21.73 12.56 20.67 13.17L16.97 15.28Z"
                        fill="#FFC107"
                      ></path>
                      <path
                        d="M3.84 21.85L13.69 12L16.97 15.28L3.84 21.85Z"
                        fill="#F44336"
                      ></path>
                      <path
                        d="M3.84 2.15L16.97 8.72L13.69 12L3.84 2.15Z"
                        fill="#2196F3"
                      ></path>
                    </svg>
                  </div>,
                  "Play Store",
                )}
              </div>

              <div className="flex flex-col flex-1 space-y-md">
                {selectedPlatform === "twitter" && (
                  <>
                    <div>
                      <label
                        className="block font-label-bold text-label-bold text-on-surface-variant mb-2"
                        htmlFor="keyword"
                      >
                        Keyword
                      </label>
                      <input
                        value={twitterKeyword}
                        onChange={(e) => setTwitterKeyword(e.target.value)}
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-on-surface font-body-sm text-body-sm transition-colors"
                        id="keyword"
                        type="text"
                        placeholder="e.g. Jokowi"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label
                          className="block font-label-bold text-label-bold text-on-surface-variant mb-2"
                          htmlFor="start-date"
                        >
                          Start Date
                        </label>
                        <input
                          type="date"
                          value={twitterStartDate}
                          onChange={(e) => setTwitterStartDate(e.target.value)}
                          className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-on-surface font-body-sm text-body-sm transition-colors"
                          id="start-date"
                        />
                      </div>
                      <div>
                        <label
                          className="block font-label-bold text-label-bold text-on-surface-variant mb-2"
                          htmlFor="end-date"
                        >
                          End Date
                        </label>
                        <input
                          type="date"
                          value={twitterEndDate}
                          onChange={(e) => setTwitterEndDate(e.target.value)}
                          className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-on-surface font-body-sm text-body-sm transition-colors"
                          id="end-date"
                        />
                      </div>
                    </div>
                    <div>
                      <label
                        className="block font-label-bold text-label-bold text-on-surface-variant mb-2"
                        htmlFor="language"
                      >
                        Language
                      </label>
                      <div className="relative">
                        <select
                          value={twitterLanguage}
                          onChange={(e) => setTwitterLanguage(e.target.value)}
                          className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-on-surface font-body-sm text-body-sm appearance-none transition-colors"
                          id="language"
                        >
                          <option value="id">Indonesian</option>
                          <option value="en">English</option>
                        </select>
                        <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-[18px] pointer-events-none">
                          expand_more
                        </span>
                      </div>
                    </div>
                    <div>
                      <label
                        className="block font-label-bold text-label-bold text-on-surface-variant mb-2"
                        htmlFor="limit"
                      >
                        Maximum records
                      </label>
                      <input
                        value={twitterLimit}
                        onChange={(e) =>
                          setTwitterLimit(Number(e.target.value))
                        }
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-on-surface font-body-sm text-body-sm transition-colors"
                        id="limit"
                        type="number"
                      />
                    </div>
                  </>
                )}

                {selectedPlatform === "youtube" && (
                  <>
                    <div>
                      <label
                        className="block font-label-bold text-label-bold text-on-surface-variant mb-2"
                        htmlFor="youtubeLink"
                      >
                        YouTube Link
                      </label>
                      <input
                        value={youtubeLink}
                        onChange={(e) => setYoutubeLink(e.target.value)}
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-on-surface font-body-sm text-body-sm transition-colors"
                        id="youtubeLink"
                        type="text"
                        placeholder="https://youtube.com/watch?v=..."
                      />
                    </div>
                    <div>
                      <label
                        className="block font-label-bold text-label-bold text-on-surface-variant mb-2"
                        htmlFor="youtubeLimit"
                      >
                        Maximum records
                      </label>
                      <input
                        value={youtubeLimit}
                        onChange={(e) =>
                          setYoutubeLimit(Number(e.target.value))
                        }
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-on-surface font-body-sm text-body-sm transition-colors"
                        id="youtubeLimit"
                        type="number"
                      />
                    </div>
                  </>
                )}

                {selectedPlatform === "playstore" && (
                  <>
                    <div>
                      <label
                        className="block font-label-bold text-label-bold text-on-surface-variant mb-2"
                        htmlFor="playstoreLink"
                      >
                        Play Store App Link
                      </label>
                      <input
                        value={playstoreLink}
                        onChange={(e) => setPlaystoreLink(e.target.value)}
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-on-surface font-body-sm text-body-sm transition-colors"
                        id="playstoreLink"
                        type="text"
                        placeholder="https://play.google.com/store/apps/details?id=..."
                      />
                    </div>
                    <div>
                      <label
                        className="block font-label-bold text-label-bold text-on-surface-variant mb-2"
                        htmlFor="playstoreLimit"
                      >
                        Maximum records
                      </label>
                      <input
                        value={playstoreLimit}
                        onChange={(e) =>
                          setPlaystoreLimit(Number(e.target.value))
                        }
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-on-surface font-body-sm text-body-sm transition-colors"
                        id="playstoreLimit"
                        type="number"
                      />
                    </div>
                  </>
                )}

                <button
                  onClick={handleScrape}
                  disabled={loading || !selectedPlatform}
                  className="w-full bg-primary hover:bg-emerald-700 text-white font-semibold py-3 px-4 rounded-lg mt-auto flex items-center justify-center gap-2 transition-colors disabled:opacity-70"
                >
                  {loading
                    ? "Fetching..."
                    : `Fetch ${selectedPlatform ? selectedPlatform.charAt(0).toUpperCase() + selectedPlatform.slice(1) : ""} Data`}
                  <span className="material-symbols-outlined text-[18px]">
                    arrow_forward
                  </span>
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Results Area */}
          <div className="lg:col-span-2 flex flex-col gap-md">
            <div className="bg-surface rounded-xl border border-outline-variant/30 shadow-sm overflow-hidden flex flex-col h-[500px] lg:h-[600px]">
              {scrapedData.length > 0 ? (
                <>
                  <div className="p-md border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                    <div>
                      <h3 className="font-headline-md text-body-lg font-bold text-on-surface">
                        Extraction Results
                      </h3>
                      <p className="font-body-sm text-body-sm text-slate-500 mt-1">
                        {scrapedData.length} records fetched successfully
                      </p>
                    </div>
                    <div className="bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full flex items-center gap-1.5 font-label-bold text-label-bold">
                      <span
                        className="material-symbols-outlined text-[14px]"
                        style={{ fontVariationSettings: "'wght' 600" }}
                      >
                        check_circle
                      </span>
                      Success
                    </div>
                  </div>

                  <div className="overflow-x-auto overflow-y-auto flex-1 min-h-0 p-0">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-slate-50 border-b border-slate-200">
                          <th className="py-3 px-4 font-label-bold text-label-bold text-slate-500 w-12">
                            #
                          </th>
                          <th className="py-3 px-4 font-label-bold text-label-bold text-slate-500">
                            Message
                          </th>
                        </tr>
                      </thead>
                      <tbody className="font-body-sm text-body-sm text-slate-700 divide-y divide-slate-100">
                        {paginatedData.map((item, index) => (
                          <tr
                            key={index}
                            className="hover:bg-slate-50 transition-colors"
                          >
                            <td className="py-3 px-4 text-slate-400">
                              {(currentPage - 1) * itemsPerPage + index + 1}
                            </td>
                            <td className="py-3 px-4 leading-relaxed">
                              {typeof item === "string"
                                ? item
                                : item.message ||
                                  item.text ||
                                  item.tweet ||
                                  item.content ||
                                  item.textOriginal ||
                                  "-"}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="p-4 border-t border-slate-100 bg-white flex justify-between items-center">
                    <span className="font-body-sm text-body-sm text-slate-500">
                      Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
                      {Math.min(currentPage * itemsPerPage, scrapedData.length)}{" "}
                      of {scrapedData.length} entries
                    </span>
                    <div className="flex gap-1">
                      <button
                        onClick={() =>
                          setCurrentPage((p) => Math.max(1, p - 1))
                        }
                        disabled={currentPage === 1}
                        className="w-8 h-8 rounded border border-slate-200 flex items-center justify-center text-slate-400 hover:bg-slate-50 hover:text-emerald-600 disabled:opacity-50 transition-colors"
                      >
                        <span className="material-symbols-outlined text-[18px]">
                          chevron_left
                        </span>
                      </button>
                      <button className="w-8 h-8 rounded border border-emerald-500 bg-emerald-50 text-emerald-600 flex items-center justify-center font-semibold text-sm transition-colors">
                        {currentPage}
                      </button>
                      <button
                        onClick={() =>
                          setCurrentPage((p) => Math.min(totalPages, p + 1))
                        }
                        disabled={currentPage === totalPages}
                        className="w-8 h-8 rounded border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-50 hover:text-emerald-600 transition-colors disabled:opacity-50"
                      >
                        <span className="material-symbols-outlined text-[18px]">
                          chevron_right
                        </span>
                      </button>
                    </div>
                  </div>

                  <div className="p-4 border-t border-slate-100 bg-slate-50/30 flex gap-3 items-stretch">
                    <button
                      onClick={handleDownloadDataset}
                      className="px-4 py-3 text-sm font-semibold text-slate-700 bg-white border border-slate-300 shadow-sm rounded-lg hover:bg-slate-50 transition-all flex items-center justify-center gap-2 active:scale-[0.98] whitespace-nowrap"
                    >
                      <span className="material-symbols-outlined text-[18px]">
                        download
                      </span>
                      Download CSV
                    </button>

                    <button
                      onClick={handleGoToAnalyzeData}
                      className="flex-1 px-4 py-3 text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-all flex items-center justify-center gap-2 shadow-sm active:scale-[0.98] whitespace-nowrap"
                    >
                      <span className="material-symbols-outlined text-[18px]">
                        analytics
                      </span>
                      Sentiment Analysis
                    </button>

                    <button
                      onClick={handleGoToFineTune}
                      className="flex-1 px-4 py-3 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-all flex items-center justify-center gap-2 shadow-sm active:scale-[0.98] whitespace-nowrap"
                    >
                      Model Fine-Tuning
                      <span className="material-symbols-outlined text-[18px] text-amber-300">
                        auto_awesome
                      </span>
                    </button>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-slate-500">
                  {loading ? (
                    <LoadingScrape statusMessage={statusMessage} />
                  ) : (
                    <>
                      <span className="material-symbols-outlined text-6xl text-slate-300 mb-4">
                        database
                      </span>
                      <h4 className="font-headline-md text-slate-400">
                        No data fetched yet
                      </h4>
                      <p className="font-body-sm max-w-md mt-2">
                        Select a platform on the left and click fetch data to
                        start the sentiment data extraction process.
                      </p>
                    </>
                  )}
                </div>
              )}
            </div>

            {statusMessage.message && !loading && (
              <div className="mt-4">
                <ErrorAlert statusMessage={statusMessage} />
              </div>
            )}
          </div>
        </div>
      </main>
      <PopUpAlert
        isPopUp={isPopUp}
        handleClosePopUp={handleClosePopUp}
        alertMessage="Download initiated! Please check your downloads folder"
      />
    </>
  );
};

export default DataExtraction;
