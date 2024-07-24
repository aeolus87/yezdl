import subprocess
from flask_socketio import emit

def crop_video_ffmpeg(input_path, output_path, start_time, end_time):
    try:
        command = [
            'ffmpeg',
            '-i', input_path,
            '-ss', str(start_time),
            '-to', str(end_time),
            '-c', 'copy',
            output_path
        ]
        
        process = subprocess.Popen(command, stdout=subprocess.PIPE, stderr=subprocess.STDOUT, universal_newlines=True)
        
        for line in process.stdout:
            if "Duration" in line or "time=" in line:
                emit('progressUpdate', {'percent': extract_progress(line)})
        
        process.wait()
        return True
    except Exception as e:
        print(f"Error cropping video: {str(e)}")
        return False

def extract_progress(line):
    # Implement logic to extract progress from ffmpeg output
    # This is a placeholder and needs to be implemented based on ffmpeg output format
    return 0