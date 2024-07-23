// backend/services/videoService.js
const ytdl = require("ytdl-core");
const ffmpeg = require("fluent-ffmpeg");
const cloudinary = require("../config/cloudinary");
const fs = require("fs");
const fsp = require("fs").promises;
const path = require("path");
const os = require("os");

exports.cropVideo = (videoUrl, startTime, endTime, socketCallback) => {
  return new Promise(async (resolve, reject) => {
    console.log(`Starting video crop process for URL: ${videoUrl}`);

    let tempFilePath;
    let outputFilePath;

    try {
      tempFilePath = path.join(os.tmpdir(), `${Date.now()}_input.mp4`);
      outputFilePath = path.join(os.tmpdir(), `${Date.now()}_output.mp4`);

      console.log(`Downloading to temporary file: ${tempFilePath}`);

      await new Promise((resolve, reject) => {
        ytdl(videoUrl, { quality: "highestaudio" })
          .pipe(fs.createWriteStream(tempFilePath))
          .on("finish", () => {
            socketCallback("processingStarted", {
              message: "Download complete. Starting ffmpeg process.",
            });
            resolve();
          })
          .on("error", reject);
      });

      await new Promise((resolve, reject) => {
        ffmpeg(tempFilePath)
          .seekInput(startTime)
          .duration(endTime - startTime)
          .outputOptions("-c copy")
          .output(outputFilePath)
          .on("progress", (progress) => {
            socketCallback("progressUpdate", {
              percent: Math.round(progress.percent),
              message: "Processing...",
            });
          })
          .on("end", resolve)
          .on("error", (err) => {
            console.error(`Error in ffmpeg process: ${err.message}`);
            reject(new Error("Error processing video"));
          })
          .run();
      });

      socketCallback("uploadStarted", {
        message: "Video processing complete, uploading to Cloudinary",
      });

      const result = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { resource_type: "video", folder: "cropped-videos" },
          (error, result) => {
            if (error) {
              console.error(`Error uploading to Cloudinary: ${error.message}`);
              reject(new Error("Error uploading video"));
            } else {
              console.log("Upload to Cloudinary successful");
              resolve(result);
            }
          }
        );

        fs.createReadStream(outputFilePath).pipe(uploadStream);
      });

      socketCallback("uploadCompleted", {
        message: "Upload to Cloudinary successful",
        url: result.secure_url,
      });

      resolve({
        success: true,
        croppedVideoUrl: result.secure_url,
        fileSize: result.bytes,
      });
    } catch (error) {
      console.error(`Error in video processing: ${error.message}`);
      socketCallback("processingFailed", {
        message: "An error occurred during processing",
        error: error.message,
      });
      reject(new Error("Error processing video"));
    } finally {
      if (tempFilePath) {
        try {
          await fsp.unlink(tempFilePath);
        } catch (err) {
          console.error(`Error deleting input temporary file: ${err.message}`);
        }
      }
      if (outputFilePath) {
        try {
          await fsp.unlink(outputFilePath);
        } catch (err) {
          console.error(`Error deleting output temporary file: ${err.message}`);
        }
      }
    }
  });
};
