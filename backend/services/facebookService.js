import axios from 'axios';

export const cropFacebookVideo = async (videoUrl, startTime, endTime) => {
  try {
    const response = await axios.post('/api/facebook/crop', { videoUrl, startTime, endTime });
    return response.data.croppedVideoUrl;
  } catch (error) {
    console.error('Error cropping Facebook video:', error);
    throw error;
  }
};
export const fetchFacebookVideo = async (url) => {
    try {
      const response = await axios.get('/api/facebook/fetch', { params: { url } });
      return response.data;
    } catch (error) {
      console.error('Error fetching Facebook video:', error);
      throw error;
    }
  };
export const downloadFacebookVideo = async (videoUrl) => {
  try {
    const response = await axios.get('/api/facebook/download', { params: { videoUrl }, responseType: 'blob' });
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'facebook_video.mp4');
    document.body.appendChild(link);
    link.click();
  } catch (error) {
    console.error('Error downloading Facebook video:', error);
    throw error;
  }
};