const ytdl = require("ytdl-core");
const ffmpeg = require("fluent-ffmpeg");
const cloudinary = require("../config/cloudinary");
const fs = require("fs");
const path = require("path");
const os = require("os");

exports.cropVideo = (videoUrl, startTime, endTime, progressCallback) => {
  return new Promise(async (resolve, reject) => {
    console.log(`Starting video crop process for URL: ${videoUrl}`);

    let tempFilePath;

    try {
      const info = await ytdl.getInfo(videoUrl);
      const format = ytdl.chooseFormat(info.formats, {
        quality: "highestaudio",
      });

      if (!format) {
        throw new Error("No suitable format found");
      }

      // Create a temporary file
      tempFilePath = path.join(os.tmpdir(), `${Date.now()}.mp4`);

      console.log(`Downloading to temporary file: ${tempFilePath}`);

      const writeStream = fs.createWriteStream(tempFilePath);
      ytdl(videoUrl, { format: format }).pipe(writeStream);

      await new Promise((resolve, reject) => {
        writeStream.on("finish", resolve);
        writeStream.on("error", reject);
      });

      console.log("Download complete. Starting ffmpeg process.");

      let croppedStream = ffmpeg(tempFilePath)
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
        const readableStream = fs.createReadStream(tempFilePath);

        const uploadStream = cloudinary.uploader.upload_stream(
          { resource_type: "video", folder: "cropped-videos" },
          (error, result) => {
            // Clean up the temporary file
            fs.unlink(tempFilePath, (err) => {
              if (err) console.error(`Error deleting temporary file: ${err}`);
            });

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
    } catch (error) {
      console.error(`Error in video processing: ${error.message}`);

      // Clean up the temporary file if it exists
      if (tempFilePath) {
        fs.unlink(tempFilePath, (err) => {
          if (err) console.error(`Error deleting temporary file: ${err}`);
        });
      }

      reject(new Error("Error processing video"));
    }
  });
};
