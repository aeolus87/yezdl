import axios from 'axios';

export const cropTikTokVideo = async (videoUrl, startTime, endTime) => {
  try {
    const response = await axios.post('/api/tiktok/crop', { videoUrl, startTime, endTime });
    return response.data.croppedVideoUrl;
  } catch (error) {
    console.error('Error cropping TikTok video:', error);
    throw error;
  }
};

export const fetchTikTokVideo = async (url) => {
    try {
      const response = await axios.get('/api/tiktok/fetch', { params: { url } });
      return response.data;
    } catch (error) {
      console.error('Error fetching TikTok video:', error);
      throw error;
    }
  };

export const downloadTikTokVideo = async (videoUrl) => {
  try {
    const response = await axios.get('/api/tiktok/download', { params: { videoUrl }, responseType: 'blob' });
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'tiktok_video.mp4');
    document.body.appendChild(link);
    link.click();
  } catch (error) {
    console.error('Error downloading TikTok video:', error);
    throw error;
  }
};