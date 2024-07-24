//manual.jsxx

import React from "react";

function HowToUse() {
  return (
    <div id="how-to-use" className="container mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold text-black mb-8 text-center">
        How to Use YTEZDL
      </h2>
      <div className="max-w-2xl mx-auto">
        <ol className="list-decimal space-y-4 pl-6">
          <li>
            <strong>Find a YouTube Video:</strong> Choose the YouTube video you
            want to crop.
          </li>
          <li>
            <strong>Copy the Video URL:</strong> Copy the full URL of the
            YouTube video from your browser's address bar.
          </li>
          <li>
            <strong>Paste the URL:</strong> Paste the copied URL into the search
            bar on our home page.
          </li>
          <li>
            <strong>Search:</strong> Click the "Search" button or press Enter to
            load the video.
          </li>
          <li>
            <strong>Set Crop Points:</strong> Use the slider below the video to
            set the start and end points for your crop.
          </li>
          <li>
            <strong>Crop Video:</strong> Click the "Crop Video" button to
            process your selection.
          </li>
          <li>
            <strong>Preview:</strong> Once processing is complete, you can
            preview your cropped video.
          </li>
          <li>
            <strong>Download:</strong> If you're satisfied with the result,
            click the "Download" button to save your cropped video.
          </li>
        </ol>
        <div
          className="mt-8 bg-blue-100 border-l-4 border-blue-500 text-blue-700 p-4"
          role="alert"
        >
          <p className="font-bold">Note:</p>
          <p>
            The video quality of the cropped video will be the highest available
            from YouTube. Processing time may vary depending on the video length
            and your internet connection speed.
          </p>
        </div>
      </div>
    </div>
  );
}

export default HowToUse;
