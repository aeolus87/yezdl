//main.jsx

import React, { useState, useEffect, useRef } from "react";
import SearchBar from "../components/searchbar";
import VideoWrapper from "../components/videowrapper";
import { extractVideoId, fetchVideoData } from "../helper/youtubeHelpers";
import HowToUse from "./howtouse";

function Main() {
  const [videoId, setVideoId] = useState(null);
  const [loading, setLoading] = useState(false);
  const howToUseRef = useRef(null);

  useEffect(() => {
    const lastSearch = localStorage.getItem("lastSearch");
    if (lastSearch) {
      localStorage.removeItem("lastSearch");
      handleSearch(lastSearch);
    }
  }, []);

  const handleSearch = async (url) => {
    const extractedVideoId = extractVideoId(url);
    if (extractedVideoId) {
      setLoading(true);
      try {
        const apiKey = process.env.REACT_APP_YOUTUBE_API_KEY;
        const videoData = await fetchVideoData(extractedVideoId, apiKey);
        if (videoData) {
          setVideoId(extractedVideoId);
        }
      } catch (error) {
        console.error("Error fetching video data:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <main className="container mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold text-[#373737] mb-8 text-center">
        Crop and Download Videos from YouTube
      </h2>
      <SearchBar onSearch={handleSearch} />
      {videoId && <VideoWrapper videoId={videoId} />}
      {loading && (
        <div className="mt-4 flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-500"></div>
        </div>
      )}
      <div ref={howToUseRef}>
        <HowToUse />
      </div>
    </main>
  );
}

export default Main;
