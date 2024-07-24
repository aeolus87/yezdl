const ytdl = require('ytdl-core');
const ffmpegHelper = require('../utils/ffmpegHelper');
const cloudinary = require('cloudinary').v2;
const { promisify } = require('util');
const fs = require('fs');
const path = require('path');

const unlinkAsync = promisify(fs.unlink);

exports.cropVideo = async (videoUrl, startTime, endTime, io) => {
  try {
    console.log('Starting video crop process');
    io.emit('processingStarted');

    const videoInfo = await ytdl.getInfo(videoUrl);
    const videoFormat = ytdl.chooseFormat(videoInfo.formats, { quality: 'highest' });
    
    console.log('Downloading video');
    const videoStream = ytdl(videoUrl, { format: videoFormat });
    
    const tempDir = path.join(__dirname, '../temp');
    if (!fs.existsSync(tempDir)){
      fs.mkdirSync(tempDir);
    }
    const outputPath = path.join(tempDir, `cropped_${Date.now()}.mp4`);
    
    console.log('Cropping video');
    await ffmpegHelper.cropVideo(videoStream, outputPath, startTime, endTime, (progress) => {
      console.log(`FFmpeg Progress: ${progress.percent}%`);
      io.emit('progressUpdate', { percent: progress.percent });
    });
    
    console.log('Uploading to Cloudinary');
    io.emit('uploadStarted');
    const cloudinaryResult = await cloudinary.uploader.upload(outputPath, {
      resource_type: 'video',
      public_id: `cropped_${Date.now()}`,
      type: 'upload',
      timeout: 120000
    });

    console.log('Deleting local file');
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

    const result = { 
      url: cloudinaryResult.secure_url, 
      fileSize: cloudinaryResult.bytes
    };

    console.log('Video processing completed');
    io.emit('uploadCompleted', result);

    return result;
  } catch (error) {
    console.error('Error in cropVideo service:', error);
    io.emit('processingFailed', { error: error.message });
    throw error;
  }
};