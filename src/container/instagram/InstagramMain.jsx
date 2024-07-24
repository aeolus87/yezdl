import React, { useState } from "react";
import SearchBar from "../../components/common/searchbar";
import InstagramWrapper from "./InstagramWrapper";
import HowToUseInstagram from "./HowToUseInstagram";
import { fetchInstagramPost } from "../../services/instagramService";

function InstagramMain() {
  const [postData, setPostData] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (url) => {
    setLoading(true);
    try {
      const data = await fetchInstagramPost(url);
      setPostData(data);
    } catch (error) {
      console.error("Error fetching Instagram post:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="container mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold text-[#373737] mb-8 text-center">
        Crop and Download Videos from Instagram
      </h2>
      <SearchBar onSearch={handleSearch} placeholder="Enter Instagram post URL" />
      {postData && <InstagramWrapper postData={postData} />}
      {loading && (
        <div className="mt-4 flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-500"></div>
        </div>
      )}
      <HowToUseInstagram />
    </main>
  );
}

export default InstagramMain;