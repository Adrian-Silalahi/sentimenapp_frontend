import React from "react";
import {
  requestBalancingData,
  requestCleanHtml,
  requestCleanText,
  requestVaderSentiment,
} from "../api/pipelinePreprocess";
import { setTableBody, setTableHeaders } from "../redux/tableSlice";
import { getTexts2D } from "./getText2D";
import { setDownloadFileNames } from "../redux/dataSlice";

// Fungsi untuk membuat jeda (delay) biar kelihatan loading
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const prepoProcessingData = async (
  preproStep,
  dispatch,
  table_body,
  setIsLoading,
  setIsProcessComplete,
  download_file_names
) => {
  setIsLoading(true);

  try {
    await sleep(1000);

    const texts = getTexts2D(table_body);

    switch (preproStep) {
      case 1: {
        const response = await requestCleanHtml(texts);
        const { cleaned_html, download_file_name } = response.data;
        dispatch(setTableHeaders(["HTML element cleansing result"]));
        dispatch(setTableBody(cleaned_html));
        const newDownloadFileNames = { ...download_file_names };
        newDownloadFileNames[0] = download_file_name;
        dispatch(setDownloadFileNames(newDownloadFileNames));
        break;
      }

      case 2: {
        const response = await requestCleanText(texts);
        const { normalized_text, download_file_name } = response.data;
        dispatch(setTableHeaders(["Normalize text result"]));
        dispatch(setTableBody(normalized_text));
        const newDownloadFileNames = { ...download_file_names };
        newDownloadFileNames[1] = download_file_name;
        dispatch(setDownloadFileNames(newDownloadFileNames));
        break;
      }

      case 3: {
        const response = await requestVaderSentiment(texts);
        const { sentiment_results, download_file_name } = response.data;
        dispatch(setTableHeaders(["Cleaning text result", "Actual label"]));
        dispatch(setTableBody(sentiment_results));
        const newDownloadFileNames = { ...download_file_names };
        newDownloadFileNames[2] = download_file_name;
        dispatch(setDownloadFileNames(newDownloadFileNames));
        break;
      }

      case 5: {
        const response = await requestBalancingData(texts);
        const { balanced_data, download_file_name } = response.data;
        dispatch(setTableHeaders(["Cleaning text result", "Actual label"]));
        dispatch(setTableBody(balanced_data));
        const newDownloadFileNames = { ...download_file_names };
        newDownloadFileNames[4] = download_file_name;
        dispatch(setDownloadFileNames(newDownloadFileNames));
        break;
      }

      default: {
        console.warn(`Unknown preprocessing step: ${preproStep}`);
      }
    }

    setIsProcessComplete(true);
  } catch (error) {
    console.error("An error occurred during data processing:", error);
    // Jika perlu, tampilkan pesan error kepada pengguna di sini
  } finally {
    // Blok ini akan selalu dijalankan, memastikan loading spinner hilang
    setIsLoading(false);
  }
};
