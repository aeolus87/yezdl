const { processVideo } = require("../utils/ffmpegHelpers");

exports.cropVideo = async (req, res) => {
  const { videoId, startTime, endTime } = req.body;
  await processVideo(videoId, startTime, endTime, res);
};
