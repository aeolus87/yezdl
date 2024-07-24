//backend\utils\ffmpegHelper.js
const ffmpeg = require('fluent-ffmpeg');

exports.cropVideo = (inputStream, outputPath, startTime, endTime, progressCallback) => {
  return new Promise((resolve, reject) => {
    ffmpeg(inputStream)
      .setStartTime(startTime)
      .setDuration(endTime - startTime)
      .output(outputPath)
      .on('progress', (progress) => {
        console.log('Processing: ' + progress.percent + '% done');
        progressCallback(progress);
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