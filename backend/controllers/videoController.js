//backend\controllers\videoController.js
const videoService = require("../services/videoService");

exports.cropVideo = async (req, res) => {
  const { videoUrl, startTime, endTime } = req.body;
  const io = req.app.get("io");

  console.log(`Crop video request received for URL: ${videoUrl}`);

  try {
    const socketCallback = (event, data) => {
      io.emit(event, data);
    };

    const result = await videoService.cropVideo(
      videoUrl,
      startTime,
      endTime,
      socketCallback
    );
    res.json(result);
  } catch (error) {
    console.error(`Error cropping video: ${error.message}`);
    res.status(500).json({ error: error.message });
  }
};
