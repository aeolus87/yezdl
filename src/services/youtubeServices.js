//yezdl-aeolus\src\helper\youtubeHelpers.js
export function extractVideoId(url) {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11 ? match[2] : null;
}

export async function fetchVideoData(videoId, apiKey) {
  if (!apiKey) {
    throw new Error("YouTube API key is missing");
  }

  try {
    const apiUrl = `https://www.googleapis.com/youtube/v3/videos?id=${videoId}&key=${apiKey}&part=snippet`;
    const response = await fetch(apiUrl);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    if (data.items && data.items.length > 0) {
      const videoTitle = data.items[0].snippet.title;
      console.log("Video Title:", videoTitle);
      return data;
    } else {
      console.error("Video not found");
      return null;
    }
  } catch (error) {
    console.error("Error fetching video data:", error);
    throw error;
  }
}
