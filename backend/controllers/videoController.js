const videoService = require("../services/videoService");

exports.cropVideo = async (req, res) => {
  const { videoUrl, startTime, endTime } = req.body;

  try {
    res.writeHead(200, {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    });

    const sendProgress = (progress) => {
      res.write(`data: ${JSON.stringify({ progress })}\n\n`);
    };

    const result = await videoService.cropVideo(
      videoUrl,
      startTime,
      endTime,
      sendProgress
    );
    res.write(`data: ${JSON.stringify(result)}\n\n`);
    res.end();
  } catch (error) {
    res.write(`data: ${JSON.stringify({ error: error.message })}\n\n`);
    res.end();
  }
};
