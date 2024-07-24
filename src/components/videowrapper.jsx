import React, { useState, useRef, useEffect } from "react";
import ReactPlayer from "react-player";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import axios from "axios";
import io from "socket.io-client";

const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL || "http://localhost:5000";

function VideoWrapper({ videoId }) {
  const [duration, setDuration] = useState(0);
  const [cropRange, setCropRange] = useState([0, 100]);
  const [croppedVideoUrl, setCroppedVideoUrl] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [fileSize, setFileSize] = useState(null);
  const [ffmpegProgress, setFfmpegProgress] = useState(null);
  const playerRef = useRef(null);

  useEffect(() => {
    const socket = io(API_BASE_URL);
    socket.on("ffmpeg_progress", (data) => {
      console.log("Progress data received:", data);
      setFfmpegProgress(data);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  if (!videoId) return null;

  const videoUrl = `https://www.youtube.com/watch?v=${videoId}`;
  const startTime = (cropRange[0] / 100) * duration;
  const endTime = (cropRange[1] / 100) * duration;

  const handleDuration = (duration) => {
    setDuration(duration);
  };

  const handleSliderChange = (value) => {
    setCropRange(value);
    if (playerRef.current) {
      playerRef.current.seekTo((value[0] / 100) * duration);
    }
  };

  const handleCrop = async () => {
    setIsProcessing(true);
    setError(null);
    setFfmpegProgress(null);
    setCroppedVideoUrl(null); // Reset cropped video URL
    try {
      const response = await axios.post(`${API_BASE_URL}/api/crop-video`, {
        videoId,
        startTime,
        endTime,
      });
      if (response.data.success) {
        setCroppedVideoUrl(response.data.croppedVideoUrl);
        setFileSize(response.data.fileSize);
      } else {
        setError(response.data.error || "Failed to crop video");
      }
    } catch (error) {
      console.error(
        "Error cropping video:",
        error.response ? error.response.data : error.message
      );
      setError(
        error.response ? error.response.data.error : "Error cropping video"
      );
    } finally {
      setIsProcessing(false); // Ensure this is always called
    }
  };

  const handleDownload = async () => {
    if (!croppedVideoUrl) {
      console.error("No cropped video URL available");
      return;
    }

    try {
      setIsProcessing(true);
      const response = await fetch(croppedVideoUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.style.display = "none";
      a.href = url;
      a.download = `ytezdlcropped-${videoId}.mp4`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading video:", error);
      setError("Error downloading video");
    } finally {
      setIsProcessing(false);
    }
  };

  function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  }

  function formatFileSize(bytes) {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  }

  return (
    <div className="flex flex-col items-center">
      <div className="video-wrapper mb-8 w-full max-w-[44rem]">
        <div className="aspect-w-16 aspect-h-9 mb-4">
          <ReactPlayer
            ref={playerRef}
            url={videoUrl}
            width="100%"
            height="100%"
            className="!h-[22rem]"
            controls={true}
            onDuration={handleDuration}
          />
        </div>
        <div className="mb-4">
          <Slider
            range
            min={0}
            max={100}
            value={cropRange}
            onChange={handleSliderChange}
          />
          <div className="flex justify-between mt-2 text-sm text-gray-600">
            <span>{formatTime(startTime)}</span>
            <span>{formatTime(endTime)}</span>
          </div>
        </div>
        <button
          onClick={handleCrop}
          className="w-full px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
          disabled={isProcessing}
        >
          {isProcessing ? "Processing..." : "Crop Video"}
        </button>
      </div>

      {isProcessing && (
  <div className="mt-4 relative">
    <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
    <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center">
      <div className="bg-white bg-opacity-80 rounded-full h-24 w-24 flex items-center justify-center">
        <div className="text-blue-500 text-center">
          <div className="font-bold text-lg">
            {ffmpegProgress && ffmpegProgress.progress !== undefined
              ? `${ffmpegProgress.progress.toFixed(0)}%`
              : "Processing..."}
          </div>
        </div>
      </div>
    </div>
  </div>
)}

      {error && <div className="mt-4 text-red-500">{error}</div>}

      {croppedVideoUrl && (
  <div className="preview-wrapper mb-8 w-full max-w-[44rem]">
    <h3 className="text-xl font-semibold mb-2 text-center">
      Cropped Video Preview
    </h3>
    <div className="aspect-w-16 aspect-h-9 mb-4">
      <video src={croppedVideoUrl} width="100%" height="100%" controls />
    </div>

    <button
      onClick={handleDownload}
      className="w-full px-4 py-2 text-white bg-green-500 rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
    >
      Download Cropped Video {fileSize && `(${formatFileSize(fileSize)})`}
    </button>
        </div>
      )}
    </div>
  );
}

export default VideoWrapper;