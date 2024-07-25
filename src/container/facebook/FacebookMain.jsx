// src/container/facebook/FacebookMain.jsx
import React, { useState } from "react";
import FacebookSearchBar from "./Searchbar";
import FacebookWrapper from "./FacebookWrapper";
import HowToUseFacebook from "./HowToUseFacebook";
import { fetchFacebookVideo } from "../../services/facebookApi";

function FacebookMain() {
  const [videoData, setVideoData] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (url) => {
    setLoading(true);
    try {
      const data = await fetchFacebookVideo(url);
      setVideoData(data);
    } catch (error) {
      console.error("Error fetching Facebook video:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="container mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold text-[#373737] mb-8 text-center">
        Download Videos from Facebook
      </h2>
      <FacebookSearchBar onSearch={handleSearch} placeholder="Enter Facebook video URL" />
      {videoData && <FacebookWrapper videoData={videoData} />}
      {loading && (
        <div className="mt-4 flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-500"></div>
        </div>
      )}
      <HowToUseFacebook />
    </main>
  );
}

export default FacebookMain;