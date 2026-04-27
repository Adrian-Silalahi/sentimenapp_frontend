import axios from "axios";
import { API_URL as BASE_URL } from "./config";

// Semua fungsi menerima array 2 dimensi
export const requestCleanHtml = (texts) => {
  return axios.post(`${BASE_URL}/clean-html`, texts);
};

export const requestCleanText = (texts) => {
  return axios.post(`${BASE_URL}/normalize-text`, texts);
};

export const requestVaderSentiment = (texts) => {
  return axios.post(`${BASE_URL}/vader-labeling`, texts);
};

export const requestBalancingData = (texts) => {
  return axios.post(`${BASE_URL}/balance-data`, texts);
};

export const requestRobertaPredict = (texts) => {
  return axios.post(`${BASE_URL}/predict_json`, texts);
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
