import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000/api';

export const fetchInstagramVideo = async (url) => {
  const response = await axios.get(`${API_BASE_URL}/instagram/info`, { params: { url } });
  return response.data;
};

export const cropInstagramVideo = async (videoUrl, startTime, endTime) => {
  const response = await axios.post(`${API_BASE_URL}/instagram/crop`, { videoUrl, startTime, endTime });
  return response.data.croppedVideoUrl;
};

export const downloadInstagramVideo = async (url) => {
  window.location.href = `${API_BASE_URL}/instagram/download?url=${encodeURIComponent(url)}`;
};