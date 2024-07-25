// backend/controllers/xController.js
const xService = require('../services/xService');
const fs = require('fs');
const { URL } = require('url');

exports.getVideoInfo = async (req, res) => {
  try {
    console.log('Received request for URL:', req.query.url);
    const { url } = req.query;
    // Validate URL
    const parsedUrl = new URL(url);
    if (!['twitter.com', 'x.com'].includes(parsedUrl.hostname)) {
      throw new Error('Invalid URL');
    }
    const videoInfo = await xService.getVideoInfo(url);
    res.json(videoInfo);
  } catch (error) {
    console.error('Error getting video info:', error);
    res.status(400).json({ error: 'Invalid URL or failed to get video info' });
  }
};

exports.cropVideo = async (req, res) => {
  try {
    const { videoUrl, startTime, endTime } = req.body;
    const croppedVideoPath = await xService.cropVideo(videoUrl, startTime, endTime);
    res.json({ croppedVideoUrl: `/api/x/video/${path.basename(croppedVideoPath)}` });
  } catch (error) {
    console.error('Error cropping video:', error);
    res.status(500).json({ error: 'Failed to crop video' });
  }
};

exports.streamVideo = (req, res) => {
    const videoPath = path.join(__dirname, '../temp', req.params.filename);
    const stat = fs.statSync(videoPath);
    const fileSize = stat.size;
    const range = req.headers.range;
  
    if (range) {
      const parts = range.replace(/bytes=/, "").split("-");
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
      const chunksize = (end - start) + 1;
      const file = fs.createReadStream(videoPath, { start, end });
      const head = {
        'Content-Range': `bytes ${start}-${end}/${fileSize}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': chunksize,
        'Content-Type': 'video/mp4',
      };
      res.writeHead(206, head);
      file.pipe(res);
    } else {
      const head = {
        'Content-Length': fileSize,
        'Content-Type': 'video/mp4',
      };
      res.writeHead(200, head);
      fs.createReadStream(videoPath).pipe(res);
    }
  };

exports.downloadVideo = async (req, res) => {
  try {
    const { url } = req.query;
    const videoInfo = await xService.getVideoInfo(url);
    res.redirect(videoInfo.videoUrl);
  } catch (error) {
    console.error('Error downloading video:', error);
    res.status(500).json({ error: 'Failed to download video' });
  }
};