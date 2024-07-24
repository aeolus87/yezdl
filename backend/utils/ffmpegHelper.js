//backend\utils\ffmpegHelper.js
const ffmpeg = require('fluent-ffmpeg');

exports.cropVideo = (inputStream, outputPath, startTime, endTime, io) => {
  return new Promise((resolve, reject) => {
    ffmpeg(inputStream)
      .setStartTime(startTime)
      .setDuration(endTime - startTime)
      .output(outputPath)
      .on('progress', (progress) => {
        io.emit('progressUpdate', { percent: progress.percent });
      })
      .on('end', () => {
        resolve();
      })
      .on('error', (err) => {
        reject(err);
      })
      .run();
  });
};