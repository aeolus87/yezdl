import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000/api';

export const fetchFacebookVideo = async (url) => {
  const response = await axios.get(`${API_BASE_URL}/facebook/info`, { params: { url } });
  return response.data;
};

export const cropFacebookVideo = async (videoUrl, startTime, endTime) => {
  const response = await axios.post(`${API_BASE_URL}/facebook/crop`, { videoUrl, startTime, endTime });
  return response.data.croppedVideoUrl;
};

export const downloadFacebookVideo = async (url) => {
  window.location.href = `${API_BASE_URL}/facebook/download?url=${encodeURIComponent(url)}`;
};