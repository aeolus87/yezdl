import youtube_dl
import os

def download_youtube_video(url):
    ydl_opts = {
        'format': 'bestaudio/best',
        'outtmpl': 'downloads/%(title)s.%(ext)s',
    }
    
    with youtube_dl.YoutubeDL(ydl_opts) as ydl:
        try:
            info = ydl.extract_info(url, download=True)
            return os.path.join('downloads', f"{info['title']}.{info['ext']}")
        except Exception as e:
            print(f"Error downloading video: {str(e)}")
            return None