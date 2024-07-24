import React, { useState, useRef, useCallback } from 'react';
import { fetchInstagramPost, cropInstagramVideo, downloadInstagramVideo } from '../../services/instagramService';

function InstagramWrapper() {
  const [postUrl, setPostUrl] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [duration, setDuration] = useState(0);
  const [cropRange, setCropRange] = useState([0, 100]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');
  const [croppedVideoUrl, setCroppedVideoUrl] = useState('');
  const videoRef = useRef(null);

  const handlePostUrlChange = useCallback((e) => {
    setPostUrl(e.target.value);
  }, []);

  const handleFetchPost = useCallback(async () => {
    if (!postUrl) return;
    setIsProcessing(true);
    setError('');
    try {
      const data = await fetchInstagramPost(postUrl);
      setVideoUrl(data.videoUrl);
      setDuration(data.duration);
    } catch (err) {
      setError('Failed to fetch Instagram post');
    } finally {
      setIsProcessing(false);
    }
  }, [postUrl]);

  const handleCropRangeChange = useCallback((newRange) => {
    setCropRange(newRange);
    if (videoRef.current) {
      videoRef.current.currentTime = (newRange[0] / 100) * duration;
    }
  }, [duration]);

  const handleCropVideo = useCallback(async () => {
    if (!videoUrl) return;
    setIsProcessing(true);
    setError('');
    try {
      const startTime = (cropRange[0] / 100) * duration;
      const endTime = (cropRange[1] / 100) * duration;
      const croppedUrl = await cropInstagramVideo(videoUrl, startTime, endTime);
      setCroppedVideoUrl(croppedUrl);
    } catch (err) {
      setError('Failed to crop video');
    } finally {
      setIsProcessing(false);
    }
  }, [videoUrl, cropRange, duration]);

  const handleDownload = useCallback(async () => {
    if (!croppedVideoUrl) return;
    setIsProcessing(true);
    setError('');
    try {
      await downloadInstagramVideo(croppedVideoUrl);
    } catch (err) {
      setError('Failed to download video');
    } finally {
      setIsProcessing(false);
    }
  }, [croppedVideoUrl]);

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Instagram Video Cropper</h2>
      <div className="mb-4">
        <input
          type="text"
          value={postUrl}
          onChange={handlePostUrlChange}
          placeholder="Enter Instagram post URL"
          className="w-full p-2 border rounded"
        />
        <button
          onClick={handleFetchPost}
          disabled={isProcessing}
          className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Fetch Video
        </button>
      </div>
      {videoUrl && (
        <div className="mb-4">
          <video ref={videoRef} src={videoUrl} controls className="w-full" />
          <input
            type="range"
            min={0}
            max={100}
            value={cropRange[0]}
            onChange={(e) => handleCropRangeChange([parseInt(e.target.value), cropRange[1]])}
            className="w-full mt-2"
          />
          <input
            type="range"
            min={0}
            max={100}
            value={cropRange[1]}
            onChange={(e) => handleCropRangeChange([cropRange[0], parseInt(e.target.value)])}
            className="w-full mt-2"
          />
          <button
            onClick={handleCropVideo}
            disabled={isProcessing}
            className="mt-2 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            Crop Video
          </button>
        </div>
      )}
      {croppedVideoUrl && (
        <div className="mb-4">
          <h3 className="text-xl font-bold mb-2">Cropped Video</h3>
          <video src={croppedVideoUrl} controls className="w-full" />
          <button
            onClick={handleDownload}
            disabled={isProcessing}
            className="mt-2 px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
          >
            Download Cropped Video
          </button>
        </div>
      )}
      {error && <p className="text-red-500">{error}</p>}
      {isProcessing && <p className="text-blue-500">Processing...</p>}
    </div>
  );
}

export default InstagramWrapper;