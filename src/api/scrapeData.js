import axios from "axios";
import { API_URL as BASE_URL } from "./config";

export const scrapeYoutubeComments = async (url, count) => {
  try {
    const response = await axios.post(`${BASE_URL}/youtube-comments/scrape`, {
      url,
      count,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const scrapePlaystoreReviews = async (url, count) => {
  try {
    const response = await axios.post(`${BASE_URL}/playstore-reviews/scrape`, {
      url,
      count,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const scrapeTwitterTweets = async (search_keyword, limit) => {
  try {
    const response = await axios.post(`${BASE_URL}/twitter-comments/scrape`, {
      search_keyword,
      limit,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const downloadScrapedFile = async (folderName, fileName) => {
  try {
    const response = await axios.get(
      `${BASE_URL}/download-${folderName}/${fileName}`,
      {
        responseType: "blob",
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};
