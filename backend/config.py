import os

class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'your-secret-key'
    UPLOAD_FOLDER = 'uploads'
    ALLOWED_EXTENSIONS = {'mp4', 'avi', 'mov'}
    MAX_CONTENT_LENGTH = 200 * 1024 * 1024  # 200 MB