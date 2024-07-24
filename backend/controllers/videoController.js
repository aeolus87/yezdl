//backend\controllers\videoController.js
const { processVideo } = require("../services/utils/ffmpegHelpers");

exports.cropVideo = async (req, res) => {
  const { videoId, startTime, endTime } = req.body;
  await processVideo(videoId, startTime, endTime, res);
};
