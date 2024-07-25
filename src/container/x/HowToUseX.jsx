//src/container/x/HowToUseX.jsx
import React from "react";

function HowToUseX() {
  return (
    <div id="how-to-use-x" className="container mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold text-black mb-8 text-center">
        How to Use X (Twitter) Video Downloader
      </h2>
      <div className="max-w-2xl mx-auto">
        <ol className="list-decimal space-y-4 pl-6">
          <li>
            <strong>Find an X (Twitter) Video:</strong> Locate the tweet containing the video you want to download.
          </li>
          <li>
            <strong>Copy the Tweet URL:</strong> Click on the tweet to open it in a new page, then copy the URL from your browser's address bar.
          </li>
          <li>
            <strong>Paste the URL:</strong> Return to this page and paste the copied URL into the search bar above.
          </li>
          <li>
            <strong>Download:</strong> Click the "Search" button and then use the download options provided.
          </li>
        </ol>
        <div className="mt-8 bg-blue-100 border-l-4 border-blue-500 text-blue-700 p-4" role="alert">
          <p className="font-bold">Note:</p>
          <p>
            Always respect copyright laws and X's terms of service when downloading and using content from the platform.
          </p>
        </div>
      </div>
    </div>
  );
}

export default HowToUseX;