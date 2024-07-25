// Frontend: src/services/xApi.js (rename from xService.js for clarity)
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000/api';

export const fetchXVideo = async (url) => {
  const response = await axios.get(`${API_BASE_URL}/x/info`, { params: { url } });
  return response.data;
};

export const cropXVideo = async (videoUrl, startTime, endTime) => {
  const response = await axios.post(`${API_BASE_URL}/x/crop`, { videoUrl, startTime, endTime });
  return response.data.croppedVideoUrl;
};

export const downloadXVideo = async (url) => {
  window.location.href = `${API_BASE_URL}/x/download?url=${encodeURIComponent(url)}`;
};