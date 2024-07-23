const ytdl = require("ytdl-core");
const ffmpeg = require("fluent-ffmpeg");
const cloudinary = require("../config/cloudinary");
const { Readable } = require("stream");

exports.cropVideo = (videoUrl, startTime, endTime, progressCallback) => {
  return new Promise((resolve, reject) => {
    const videoId = ytdl.getVideoID(videoUrl);
    const stream = ytdl(videoUrl, { quality: "highestaudio" });

    let croppedStream = ffmpeg(stream)
      .seekInput(startTime)
      .duration(endTime - startTime)
      .outputOptions("-c copy")
      .outputFormat("mp4")
      .on("progress", (progress) => {
        if (progressCallback) {
          progressCallback(progress.percent);
        }
      })
      .on("error", (err) => {
        reject(err);
      });

    let chunks = [];
    croppedStream.on("data", (chunk) => {
      chunks.push(chunk);
    });

    croppedStream.on("end", () => {
      const readableStream = new Readable();
      readableStream.push(Buffer.concat(chunks));
      readableStream.push(null);

      const uploadStream = cloudinary.uploader.upload_stream(
        { resource_type: "video", folder: "cropped-videos" },
        (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve({
              success: true,
              croppedVideoUrl: result.secure_url,
              fileSize: result.bytes,
            });
          }
        }
      );

      readableStream.pipe(uploadStream);
    });
  });
};
