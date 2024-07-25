import React, { useState } from "react";
import SearchBar from "../../container/instagram/SearchBar";
import InstagramWrapper from "./InstagramWrapper";
import HowToUseInstagram from "./HowToUseInstagram";
import { fetchInstagramVideo } from "../../services/instagramApi";

function InstagramMain() {
  const [postData, setPostData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSearch = async (url) => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchInstagramVideo(url);
      setPostData(data);
    } catch (error) {
      console.error("Error fetching Instagram post:", error);
      setError("Failed to fetch the Instagram reel. Please check the URL and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="container mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold text-[#373737] mb-8 text-center">
        Download Videos from Instagram Reels
      </h2>
      <SearchBar onSearch={handleSearch} placeholder="Enter Instagram reel URL" />
      {loading && (
        <div className="mt-4 flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-500"></div>
        </div>
      )}
      {error && (
        <div className="mt-4 text-red-500 text-center">{error}</div>
      )}
      {postData && <InstagramWrapper postData={postData} />}
      <HowToUseInstagram />
    </main>
  );
}

export default InstagramMain;