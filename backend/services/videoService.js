const ytdl = require('ytdl-core');
const ffmpegHelper = require('../utils/ffmpegHelper');
const { io } = require('../server');

exports.cropVideo = async (videoUrl, startTime, endTime) => {
  try {
    const videoInfo = await ytdl.getInfo(videoUrl);
    const videoFormat = ytdl.chooseFormat(videoInfo.formats, { quality: 'highest' });
    
    const videoStream = ytdl(videoUrl, { format: videoFormat });
    
    const outputPath = `./temp/cropped_${Date.now()}.mp4`;
    
    await ffmpegHelper.cropVideo(videoStream, outputPath, startTime, endTime);
    
    // Here you would typically upload the file to a storage service
    // and return the URL. For this example, we'll just return a dummy URL.
    const dummyUrl = `https://example.com/${outputPath}`;
    const fileSize = 1024 * 1024; // 1MB, replace with actual file size

    return { url: dummyUrl, fileSize };
  } catch (error) {
    console.error('Error in cropVideo service:', error);
    throw error;
  }
};