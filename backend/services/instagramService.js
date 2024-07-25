import axios from 'axios';

export const cropInstagramVideo = async (videoUrl, startTime, endTime) => {
  try {
    const response = await axios.post('/api/instagram/crop', { videoUrl, startTime, endTime });
    return response.data.croppedVideoUrl;
  } catch (error) {
    console.error('Error cropping Instagram video:', error);
    throw error;
  }
};

export const downloadInstagramVideo = async (videoUrl) => {
  try {
    const response = await axios.get('/api/instagram/download', { params: { videoUrl }, responseType: 'blob' });
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'instagram_video.mp4');
    document.body.appendChild(link);
    link.click();
  } catch (error) {
    console.error('Error downloading Instagram video:', error);
    throw error;
  }
};
export const fetchInstagramPost = async (url) => {
  const options = {
    method: 'GET',
    url: 'https://instagram-scraper-api2.p.rapidapi.com/v1.2/reels',
    params: { username_or_id_or_url: url },
    headers: {
      'x-rapidapi-host': 'instagram-scraper-api2.p.rapidapi.com',
      'x-rapidapi-key': '6bf652bd15msh58dab9362b03f5dp17e9c3jsna93968575eb9'
    }
  };

  try {
    const response = await axios.request(options);
    if (response.data && response.data.length > 0) {
      const reel = response.data[0];
      return {
        videoUrl: reel.video_url,
        duration: reel.duration,
        // Add any other properties you need
      };
    } else {
      throw new Error('No reel data found');
    }
  } catch (error) {
    console.error('Error fetching Instagram reel:', error);
    throw error;
  }
};

