//backend\services\videoService.js
const ytdl = require("ytdl-core");
const ffmpeg = require("fluent-ffmpeg");
const cloudinary = require("../config/cloudinary");
const { Readable } = require("stream");

exports.cropVideo = (videoUrl, startTime, endTime, progressCallback) => {
  return new Promise((resolve, reject) => {
    console.log(`Starting video crop process for URL: ${videoUrl}`);

    let videoId;
    try {
      videoId = ytdl.getVideoID(videoUrl);
    } catch (error) {
      console.error(`Error getting video ID: ${error.message}`);
      return reject(new Error("Invalid YouTube URL"));
    }

    const stream = ytdl(videoUrl, { quality: "highestaudio" });

    stream.on("error", (err) => {
      console.error(`Error in ytdl stream: ${err.message}`);
      reject(new Error("Error downloading video"));
    });

    let croppedStream = ffmpeg(stream)
      .seekInput(startTime)
      .duration(endTime - startTime)
      .outputOptions("-c copy")
      .outputFormat("mp4")
      .on("progress", (progress) => {
        if (progressCallback) {
          progressCallback(Math.round(progress.percent));
        }
      })
      .on("error", (err) => {
        console.error(`Error in ffmpeg process: ${err.message}`);
        reject(new Error("Error processing video"));
      });

    let chunks = [];
    croppedStream.on("data", (chunk) => {
      chunks.push(chunk);
    });

    croppedStream.on("end", () => {
      console.log("Video processing complete, uploading to Cloudinary");
      const readableStream = new Readable();
      readableStream.push(Buffer.concat(chunks));
      readableStream.push(null);

      const uploadStream = cloudinary.uploader.upload_stream(
        { resource_type: "video", folder: "cropped-videos" },
        (error, result) => {
          if (error) {
            console.error(`Error uploading to Cloudinary: ${error.message}`);
            reject(new Error("Error uploading video"));
          } else {
            console.log("Upload to Cloudinary successful");
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
