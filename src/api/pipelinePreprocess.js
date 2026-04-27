import axios from "axios";
import { API_URL as BASE_URL } from "./config";

// Semua fungsi menerima array 2 dimensi (tanpa key objek)
export const requestCleanHtml = (texts) => {
  return axios.post(`${BASE_URL}/clean-html`, texts);
};

export const requestCleanText = (texts) => {
  return axios.post(`${BASE_URL}/pipeline/normalize`, texts);
};

export const requestVaderSentiment = (texts) => {
  return axios.post(`${BASE_URL}/pipeline/label-with-vader`, texts);
};

export const requestBalancingData = (texts) => {
  return axios.post(`${BASE_URL}/pipeline/balance`, texts);
};

export const downloadPreprocessedFile = async (fileName) => {
  try {
    const response = await axios.get(
      `${BASE_URL}/download-temp-file/${fileName}`,
      {
        responseType: "blob",
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};
