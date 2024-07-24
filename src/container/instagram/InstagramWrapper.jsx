import React, { useState, useRef } from "react";
import ReactPlayer from "react-player";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import { cropInstagramVideo, downloadInstagramVideo } from "../../services/instagramService";

function InstagramWrapper({ postData }) {
  const [cropRange, setCropRange] = useState([0, 100]);
  const [croppedVideoUrl, setCroppedVideoUrl] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);
  const playerRef = useRef(null);

  const { videoUrl, duration } = postData;
  const startTime = (cropRange[0] / 100) * duration;
  const endTime = (cropRange[1] / 100) * duration;

  const handleSliderChange = (value) => {
    setCropRange(value);
    if (playerRef.current) {
      playerRef.current.seekTo((value[0] / 100) * duration);
    }
  };

  const handleCrop = async () => {
    setIsProcessing(true);
    setError(null);
    setCroppedVideoUrl(null);
    try {
      const croppedUrl = await cropInstagramVideo(videoUrl, startTime, endTime);
      setCroppedVideoUrl(croppedUrl);
    } catch (error) {
      console.error("Error cropping video:", error);
      setError("Failed to crop video");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = async () => {
    if (!croppedVideoUrl) {
      console.error("No cropped video URL available");
      return;
    }
    try {
      await downloadInstagramVideo(croppedVideoUrl);
    } catch (error) {
      console.error("Error downloading video:", error);
      setError("Error downloading video");
    }
  };

  function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
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
            Download Cropped Video
          </button>
        </div>
      )}
    </div>
  );
}

export default InstagramWrapper;