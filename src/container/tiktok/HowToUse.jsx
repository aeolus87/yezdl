// src/container/tiktok/HowToUseTikTok.jsx
import React from "react";

function HowToUseTikTok() {
  return (
    <div id="how-to-use-tiktok" className="container mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold text-black mb-8 text-center">
        How to Use TikTok Video Downloader
      </h2>
      <div className="max-w-2xl mx-auto">
        <ol className="list-decimal space-y-4 pl-6">
          <li>
            <strong>Find a TikTok Video:</strong> Open the TikTok app or website and find the video you want to download.
          </li>
          <li>
            <strong>Copy the Video Link:</strong> Tap the "Share" button and choose "Copy Link".
          </li>
          <li>
            <strong>Paste the URL:</strong> Come back to this page and paste the copied URL into the search bar above.
          </li>
          <li>
            <strong>Download:</strong> Click the "Search" button and then use the download options provided.
          </li>
        </ol>
        <div className="mt-8 bg-blue-100 border-l-4 border-blue-500 text-blue-700 p-4" role="alert">
          <p className="font-bold">Note:</p>
          <p>
            Always respect copyright laws and TikTok's terms of service when downloading and using content.
          </p>
        </div>
      </div>
    </div>
  );
}

export default HowToUseTikTok;