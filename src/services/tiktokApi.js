import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000/api';

export const fetchTikTokVideo = async (url) => {
  const response = await axios.get(`${API_BASE_URL}/tiktok/info`, { params: { url } });
  return response.data;
};

export const cropTikTokVideo = async (videoUrl, startTime, endTime) => {
  const response = await axios.post(`${API_BASE_URL}/tiktok/crop`, { videoUrl, startTime, endTime });
  return response.data.croppedVideoUrl;
};

export const downloadTikTokVideo = async (url) => {
  window.location.href = `${API_BASE_URL}/tiktok/download?url=${encodeURIComponent(url)}`;
};