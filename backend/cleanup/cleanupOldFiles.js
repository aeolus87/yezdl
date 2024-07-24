const cloudinary = require("cloudinary").v2;

async function cleanupOldFiles() {
  const oneHourAgo = new Date(Date.now() - 3600000).toISOString();

  try {
    const result = await cloudinary.api.delete_resources_by_prefix(
      "cropped_videos/",
      {
        type: "upload",
        resource_type: "video",
        created_at: { lte: oneHourAgo },
      }
    );
    console.log("Cleanup result:", result);
  } catch (error) {
    console.error("Error cleaning up old files:", error);
  }
}

module.exports = cleanupOldFiles;
