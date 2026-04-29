import os
from dotenv import load_dotenv

# Ensure .env file is loaded with proper path handling
dotenv_path = os.path.join(os.path.dirname(__file__), '.env')
load_dotenv(dotenv_path)

class Config:
    # Secret key for session management
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'quizflow-secret-key-2024'
    
    # Database Configuration - MySQL
    MYSQL_HOST = os.environ.get('MYSQL_HOST', '127.0.0.1')
    MYSQL_PORT = os.environ.get('MYSQL_PORT', '3306')
    MYSQL_USER = os.environ.get('MYSQL_USER', 'root')
    MYSQL_PASSWORD = os.environ.get('MYSQL_PASSWORD', '123456')
    MYSQL_DATABASE = os.environ.get('MYSQL_DATABASE', 'ninequiz_db')
    
    SQLALCHEMY_DATABASE_URI = f"mysql+pymysql://{MYSQL_USER}:{MYSQL_PASSWORD}@{MYSQL_HOST}:{MYSQL_PORT}/{MYSQL_DATABASE}?charset=utf8mb4"
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SQLALCHEMY_ECHO = False
    
    # Flask-WTF
    WTF_CSRF_ENABLED = True
    
    # Pagination
    ITEMS_PER_PAGE = 10
    
    # File Upload
    MAX_CONTENT_LENGTH = 16 * 1024 * 1024  # 16MB max
    UPLOAD_FOLDER = 'static/uploads'
    ALLOWED_EXTENSIONS = {'xlsx', 'xls', 'png', 'jpg', 'jpeg', 'gif'}

    # AI providers (NineGPT) - Enhanced Configuration
    # ==========================================
    OPENAI_API_KEY = os.environ.get('OPENAI_API_KEY')
    OPENAI_MODEL = os.environ.get('OPENAI_MODEL', 'gpt-4o-mini')
    
    # Gemini models: Tự động query danh sách model khả dụng
    # v1beta: 38 models (gemini-2.5-flash, gemini-2.0-flash, etc.)
    # v1: 7 models (limited subset)
    # Recommendation: gemini-2.5-flash (latest, fastest) on v1beta
    GEMINI_API_KEY = os.environ.get('GEMINI_API_KEY')
    GEMINI_MODEL = os.environ.get('GEMINI_MODEL', 'gemini-2.5-flash')
    
    # Gemini API version - v1beta có nhiều model hơn v1
    # API tự động fallback v1 → v1beta nếu model không tìm thấy
    GEMINI_API_VERSION = os.environ.get('GEMINI_API_VERSION', 'v1beta')
    
    # AI Retry Configuration
    # =====================
    AI_MAX_RETRIES = int(os.environ.get('AI_MAX_RETRIES', 3))
    AI_RETRY_DELAY = int(os.environ.get('AI_RETRY_DELAY', 2))  # seconds
    AI_RETRY_BACKOFF = float(os.environ.get('AI_RETRY_BACKOFF', 2.0))  # exponential backoff multiplier
    
    # Fallback strategy
    AI_ENABLE_FALLBACK = os.environ.get('AI_ENABLE_FALLBACK', 'true').lower() == 'true'
    AI_FALLBACK_PROVIDER = os.environ.get('AI_FALLBACK_PROVIDER', 'gemini')  # fallback to gemini when openai fails

