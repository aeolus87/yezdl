const ffmpeg = require('fluent-ffmpeg');
const { io } = require('../server');

exports.cropVideo = (inputStream, outputPath, startTime, endTime) => {
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