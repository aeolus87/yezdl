import os
from flask import current_app
from utils.ffmpeg_helper import crop_video_ffmpeg
from services.youtube_service import download_youtube_video

def crop_video(video_url, start_time, end_time):
    # Download YouTube video
    video_path = download_youtube_video(video_url)
    
    if not video_path:
        return {'error': 'Failed to download video'}
    
    # Crop video
    output_path = os.path.join(current_app.config['UPLOAD_FOLDER'], 'cropped_video.mp4')
    success = crop_video_ffmpeg(video_path, output_path, start_time, end_time)
    
    if not success:
        return {'error': 'Failed to crop video'}
    
    # Return the URL of the cropped video
    return {'url': f'/uploads/cropped_video.mp4'}