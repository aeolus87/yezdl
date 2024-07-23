const youtubedl = require("youtube-dl-exec");
const ffmpeg = require("fluent-ffmpeg");
const cloudinary = require("../config/cloudinary");
const fs = require("fs");
const path = require("path");
const os = require("os");

exports.cropVideo = (videoUrl, startTime, endTime, progressCallback) => {
  return new Promise(async (resolve, reject) => {
    console.log(`Starting video crop process for URL: ${videoUrl}`);

    let tempFilePath;
    let outputFilePath;

    try {
      // Create temporary files
      tempFilePath = path.join(os.tmpdir(), `${Date.now()}_input.mp4`);
      outputFilePath = path.join(os.tmpdir(), `${Date.now()}_output.mp4`);

      console.log(`Downloading to temporary file: ${tempFilePath}`);

      await youtubedl(videoUrl, {
        output: tempFilePath,
        format: "bestaudio/best",
        noCheckCertificates: true,
        noWarnings: true,
        preferFreeFormats: true,
        addHeader: [
          "referer:youtube.com",
          "user-agent:Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
        ],
      });

      console.log("Download complete. Starting ffmpeg process.");

      await new Promise((resolve, reject) => {
        ffmpeg(tempFilePath)
          .seekInput(startTime)
          .duration(endTime - startTime)
          .outputOptions("-c copy")
          .output(outputFilePath)
          .on("progress", (progress) => {
            if (progressCallback) {
              progressCallback(Math.round(progress.percent));
            }
          })
          .on("end", resolve)
          .on("error", (err) => {
            console.error(`Error in ffmpeg process: ${err.message}`);
            reject(new Error("Error processing video"));
          })
          .run();
      });

      console.log("Video processing complete, uploading to Cloudinary");

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

      resolve({
        success: true,
        croppedVideoUrl: result.secure_url,
        fileSize: result.bytes,
      });
    } catch (error) {
      console.error(`Error in video processing: ${error.message}`);
      reject(new Error("Error processing video"));
    } finally {
      if (tempFilePath) {
        fs.unlink(tempFilePath, (err) => {
          if (err) console.error(`Error deleting input temporary file: ${err}`);
        });
      }
      if (outputFilePath) {
        fs.unlink(outputFilePath, (err) => {
          if (err)
            console.error(`Error deleting output temporary file: ${err}`);
        });
      }
    }
  });
};
