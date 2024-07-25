//src\container\x\XMain.jsx
import React, { useState } from "react";
import SearchBar from "./XSearchBar";
import XWrapper from "./XWrapper";
import HowToUseX from "./HowToUseX";
import { fetchXVideo } from "../../services/xApi";

function XMain() {
    const [videoData, setVideoData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
  
    const handleSearch = async (url) => {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchXVideo(url);
        setVideoData(data);
      } catch (error) {
        console.error("Error fetching X video:", error);
        setError("Failed to fetch video. Please check the URL and try again.");
      } finally {
        setLoading(false);
      }
    };
  

  return (
    <main className="container mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold text-[#373737] mb-8 text-center">
        Download Videos from X
      </h2>
      <SearchBar onSearch={handleSearch} placeholder="Enter X (Twitter) video URL" />
      {videoData && <XWrapper videoData={videoData} />}
      {loading && (
        <div className="mt-4 flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-500"></div>
        </div>
      )}
      <HowToUseX />
    </main>
  );
}

export default XMain;