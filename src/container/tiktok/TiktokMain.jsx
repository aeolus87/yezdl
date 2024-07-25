// src/container/tiktok/TikTokMain.jsx
import React, { useState } from "react";
import TikTokSearchBar from "./Searchbar";
import TikTokWrapper from "./TiktokWrapper";
import HowToUseTikTok from "./HowToUse";
import { fetchTikTokVideo } from "../../services/tiktokApi";

function TikTokMain() {
  const [videoData, setVideoData] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (url) => {
    setLoading(true);
    try {
      const data = await fetchTikTokVideo(url);
      setVideoData(data);
    } catch (error) {
      console.error("Error fetching TikTok video:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="container mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold text-[#373737] mb-8 text-center">
        Download Videos from TikTok
      </h2>
      <TikTokSearchBar onSearch={handleSearch} placeholder="Enter TikTok video URL" />
      {videoData && <TikTokWrapper videoData={videoData} />}
      {loading && (
        <div className="mt-4 flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-500"></div>
        </div>
      )}
      <HowToUseTikTok />
    </main>
  );
}

export default TikTokMain;