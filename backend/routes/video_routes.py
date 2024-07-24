from flask import Blueprint, request, jsonify
from services.video_service import crop_video

video_bp = Blueprint('video', __name__)

@video_bp.route('/api/crop-video', methods=['POST'])
def crop_video_route():
    data = request.json
    video_url = data.get('videoUrl')
    start_time = data.get('startTime')
    end_time = data.get('endTime')
    
    result = crop_video(video_url, start_time, end_time)
    return jsonify(result)from flask import Blueprint, request, jsonify
from services.video_service import crop_video

video_bp = Blueprint('video', __name__)

@video_bp.route('/api/crop-video', methods=['POST'])
def crop_video_route():
    data = request.json
    video_url = data.get('videoUrl')
    start_time = data.get('startTime')
    end_time = data.get('endTime')
    
    result = crop_video(video_url, start_time, end_time)
    return jsonify(result)