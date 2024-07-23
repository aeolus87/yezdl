//backend\controllers\videoController.js
const videoService = require("../services/videoService");

exports.cropVideo = async (req, res) => {
  const { videoUrl, startTime, endTime } = req.body;

  console.log(`Crop video request received for URL: ${videoUrl}`);

  try {
    res.writeHead(200, {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    });

    const sendProgress = (progress) => {
      res.write(`data: ${JSON.stringify({ progress })}\n\n`);
    };

    // Send a ping every 30 seconds to keep the connection alive
    const pingInterval = setInterval(() => {
      res.write(": ping\n\n");
    }, 30000);

    const result = await videoService.cropVideo(
      videoUrl,
      startTime,
      endTime,
      sendProgress
    );
    res.write(`data: ${JSON.stringify(result)}\n\n`);
    res.end();

    clearInterval(pingInterval);
  } catch (error) {
    console.error(`Error cropping video: ${error.message}`);
    res.write(`data: ${JSON.stringify({ error: error.message })}\n\n`);
    res.end();
  }
};
