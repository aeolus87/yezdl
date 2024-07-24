//backend\services\videoService.js
const ytdl = require('ytdl-core');
const ffmpegHelper = require('../utils/ffmpegHelper');
const cloudinary = require('cloudinary').v2;
const { promisify } = require('util');
const fs = require('fs');
const path = require('path');

const unlinkAsync = promisify(fs.unlink);

exports.cropVideo = async (videoUrl, startTime, endTime, io) => {
  try {
    const videoInfo = await ytdl.getInfo(videoUrl);
    const videoFormat = ytdl.chooseFormat(videoInfo.formats, { quality: 'highest' });
    
    const videoStream = ytdl(videoUrl, { format: videoFormat });
    
    const tempDir = path.join(__dirname, '../temp');
    if (!fs.existsSync(tempDir)){
      fs.mkdirSync(tempDir);
    }
    const outputPath = path.join(tempDir, `cropped_${Date.now()}.mp4`);
    
    await ffmpegHelper.cropVideo(videoStream, outputPath, startTime, endTime, io);
    
    // Upload to Cloudinary
    const cloudinaryResult = await cloudinary.uploader.upload(outputPath, {
      resource_type: 'video',
      public_id: `cropped_${Date.now()}`,
      type: 'upload',
      timeout: 120000
    });

    // Delete local file
    await unlinkAsync(outputPath);

    // Schedule deletion from Cloudinary after 1 hour
    setTimeout(async () => {
      try {
        await cloudinary.uploader.destroy(cloudinaryResult.public_id, { resource_type: 'video' });
        console.log(`Deleted video: ${cloudinaryResult.public_id}`);
      } catch (error) {
        console.error('Error deleting video from Cloudinary:', error);
      }
    }, 3600000); // 1 hour in milliseconds

    return { 
      url: cloudinaryResult.secure_url, 
      fileSize: cloudinaryResult.bytes
    };
  } catch (error) {
    console.error('Error in cropVideo service:', error);
    throw error;
  }
};