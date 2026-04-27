import { API_URL } from "./config";

export const downloadResultAPI = async (downloadId) => {
  const response = fetch(`${API_URL}/download/${downloadId}`);
  return response;
};
