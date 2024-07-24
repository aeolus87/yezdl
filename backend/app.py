from flask import Flask
from flask_cors import CORS
from flask_socketio import SocketIO
from config import Config
from routes.video_routes import video_bp

app = Flask(__name__)
app.config.from_object(Config)
CORS(app)
socketio = SocketIO(app, cors_allowed_origins="*")

app.register_blueprint(video_bp)

if __name__ == '__main__':
    socketio.run(app, debug=True)