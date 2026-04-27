import axios from "axios";
import { API_URL } from "./config";

export const predictTextSentimentAPI = async (text) => {
  const response = await axios.post(`${API_URL}/predict`, { text });
  return response.data;
};

export const predictFileSentimentAPI = async (file) => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await axios.post(`${API_URL}/predict_file/`, formData);

  return response.data;
};
