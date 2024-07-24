const videoService = require('../services/videoService');
const { io } = require('../server');

exports.cropVideo = async (req, res) => {
  const { videoUrl, startTime, endTime } = req.body;
  
  try {
    io.emit('processingStarted');
    const result = await videoService.cropVideo(videoUrl, startTime, endTime);
    io.emit('uploadCompleted', result);
    res.json(result);
  } catch (error) {
    console.error('Error in cropVideo:', error);
    io.emit('processingFailed', { error: error.message });
    res.status(500).json({ error: error.message });
  }
};