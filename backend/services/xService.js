// backend/services/xService.js
const axios = require('axios');
const ffmpeg = require('fluent-ffmpeg');
const fs = require('fs');
const path = require('path');

const API_BASE_URL = 'https://api.twitter.com/2';
const BEARER_TOKEN = process.env.X_BEARER_TOKEN;

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Authorization': `Bearer ${BEARER_TOKEN}`,
    'Content-Type': 'application/json',
  },
});



exports.getVideoInfo = async (tweetUrl) => {
  const tweetId = extractTweetId(tweetUrl);
  const response = await api.get(`/tweets/${tweetId}`, {
    params: {
      'tweet.fields': 'attachments,entities',
      'expansions': 'attachments.media_keys',
      'media.fields': 'duration_ms,height,width,preview_image_url,type,url,variants',
    },
  });

  return extractVideoData(response.data);
};

exports.cropVideo = async (videoUrl, startTime, endTime) => {
  const outputPath = path.join(__dirname, '../temp', `cropped_${Date.now()}.mp4`);
  
  return new Promise((resolve, reject) => {
    ffmpeg(videoUrl)
      .setStartTime(startTime)
      .setDuration(endTime - startTime)
      .output(outputPath)
      .on('end', () => resolve(outputPath))
      .on('error', (err) => {
        console.error('Error cropping video:', err);
        reject(new Error('Failed to crop video'));
      })
      .run();
  });
};

exports.getVideoStream = (videoPath) => {
  return fs.createReadStream(videoPath);
};

function extractTweetId(url) {
  const match = url.match(/\/status\/(\d+)/);
  return match ? match[1] : null;
}

function extractVideoData(responseData) {
  const media = responseData.includes.media[0];

  if (media.type !== 'video') {
    throw new Error('The tweet does not contain a video');
  }

  const videoVariant = media.variants.find(v => v.content_type === 'video/mp4') || media.variants[0];

  return {
    videoUrl: videoVariant.url,
    duration: media.duration_ms / 1000,
    width: media.width,
    height: media.height,
    format: videoVariant.content_type
  };
}

// Add this function
async function cleanupTempFiles() {
  const tempDir = path.join(__dirname, '../temp');
  const files = await fs.readdir(tempDir);
  const oneHourAgo = Date.now() - 3600000;

  for (const file of files) {
    const filePath = path.join(tempDir, file);
    const stats = await fs.stat(filePath);
    if (stats.mtimeMs < oneHourAgo) {
      await fs.unlink(filePath);
    }
  }
}

// Call this function periodically, e.g., every hour
setInterval(cleanupTempFiles, 3600000);