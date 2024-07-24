const ffmpeg = require("fluent-ffmpeg");
const ytdl = require("ytdl-core");
const path = require("path");
const fs = require("fs");
const cloudinaryUpload = require("./cloudinaryConfig");
const ffmpegPath = require("@ffmpeg-installer/ffmpeg").path;

ffmpeg.setFfmpegPath(ffmpegPath);

function timemarkToSeconds(timemark) {
  const [hours, minutes, seconds] = timemark.split(":").map(parseFloat);
  return hours * 3600 + minutes * 60 + seconds;
}

async function processVideo(videoId, startTime, endTime, res) {
  const videoUrl = `https://www.youtube.com/watch?v=${videoId}`;
  const outputPath = path.join(__dirname, `../ytezdlcropped-${videoId}-${Date.now()}.mp4`);

  console.log(`Processing video: ${videoId}`);
  console.log(`Start time: ${startTime}, End time: ${endTime}`);

  try {
    const info = await ytdl.getInfo(videoUrl);
    let format = ytdl.chooseFormat(info.formats, {
      quality: "highestvideo",
      filter: "audioandvideo",
    });

    if (!format.hasAudio) {
      console.warn("Selected format does not have audio. Falling back to format with audio.");
      format = ytdl.chooseFormat(info.formats, { filter: "audioandvideo" });
    }

    if (!format.hasAudio) {
      console.error("No format with audio found.");
      return res.status(400).json({ error: "No audio stream available for this video" });
    }

    console.log(`Selected format: ${format.qualityLabel}`);

    const stream = ytdl(videoUrl, { format: format });
    let hasAudioCodec = false;
    const totalDuration = endTime - startTime;

    ffmpeg(stream)
      .setStartTime(startTime)
      .setDuration(totalDuration)
      .outputOptions([
        "-c:v libx264",
        "-preset medium",
        "-crf 17",
        "-c:a aac",
        "-b:a 128k",
        "-strict experimental",
      ])
      .output(outputPath)
      .on("start", (commandLine) => {
        console.log("FFmpeg process started:", commandLine);
      })
      .on("progress", (progress) => {
        const currentTime = progress.timemark ? timemarkToSeconds(progress.timemark) : 0;
        const percent = Math.min(
          Math.max((currentTime / totalDuration) * 100, 0),
          100
        ).toFixed(2);
        console.log(`Processing: ${percent}% done`);
        global.io.emit("ffmpeg_progress", {
          progress: parseFloat(percent),
          timemark: progress.timemark,
        });
      })
      .on("stderr", (line) => {
        console.log("FFmpeg stderr:", line);
        if (line.includes("Stream #0:1") && line.includes("Audio:")) {
          hasAudioCodec = true;
        }
      })
      .on("end", async () => {
        console.log("FFmpeg process completed");
        if (!hasAudioCodec) {
          console.warn("No audio codec detected in the output.");
        }
        try {
          const result = await cloudinaryUpload(outputPath, {
            resource_type: "video",
            public_id: `ytezdlcropped-${videoId}-${Date.now()}`,
            folder: "cropped_videos",
          });

          // Delete local file after upload
          fs.unlink(outputPath, (err) => {
            if (err) console.error("Error deleting local file:", err);
          });

          res.json({
            success: true,
            message: "Video processed and uploaded successfully",
            croppedVideoUrl: result.secure_url,
            fileSize: result.bytes,
            expiresAt: new Date(Date.now() + 3600000).toISOString(), // 1 hour from now
          });
        } catch (uploadError) {
          console.error("Error uploading to Cloudinary:", uploadError);
          res.status(500).json({ error: "Failed to upload video" });
        }
      })
      .on("error", (err, stdout, stderr) => {
        console.error("FFmpeg error:", err);
        console.error("FFmpeg stdout:", stdout);
        console.error("FFmpeg stderr:", stderr);
        res.status(500).json({ error: "Failed to process video", details: err.message });
      })
      .run();
  } catch (error) {
    console.error("Error processing request:", error);
    res.status(500).json({ error: "Failed to process video", details: error.message });
  }
}

module.exports = { processVideo };
