// src/container/facebook/HowToUseFacebook.jsx
import React from "react";

function HowToUseFacebook() {
  return (
    <div id="how-to-use-facebook" className="container mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold text-black mb-8 text-center">
        How to Use Facebook Video Downloader
      </h2>
      <div className="max-w-2xl mx-auto">
        <ol className="list-decimal space-y-4 pl-6">
          <li>
            <strong>Find a Facebook Video:</strong> Navigate to the Facebook video you want to download.
          </li>
          <li>
            <strong>Copy the Video URL:</strong> Click on the video to open it in full view, then copy the URL from your browser's address bar.
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
            Ensure you have the right to download and use the video content. Respect copyright laws and Facebook's terms of service.
          </p>
        </div>
      </div>
    </div>
  );
}

export default HowToUseFacebook;