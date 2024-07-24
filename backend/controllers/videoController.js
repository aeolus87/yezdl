//backend\controllers\videoController.js
const videoService = require('../services/videoService');

exports.cropVideo = async (req, res) => {
  const { videoUrl, startTime, endTime } = req.body;
  
  try {
    req.io.emit('processingStarted');
    const result = await videoService.cropVideo(videoUrl, startTime, endTime, req.io);
    req.io.emit('uploadCompleted', result);
    res.json(result);
  } catch (error) {
    console.error('Error in cropVideo:', error);
    req.io.emit('processingFailed', { error: error.message });
    res.status(500).json({ error: error.message });
  }
};