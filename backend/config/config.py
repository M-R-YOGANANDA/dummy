import os

BASE_DIR = os.path.abspath(os.path.dirname(__file__))
DB_DIR = os.path.join(os.path.dirname(BASE_DIR), "instance")
os.makedirs(DB_DIR, exist_ok=True)


class Config:
    SECRET_KEY = os.getenv("SECRET_KEY", "dev-secret-key-change-in-production")

    # SQLite Database URI (instead of MySQL)
    SQLALCHEMY_DATABASE_URI = os.getenv(
        "DATABASE_URL",
        f"sqlite:///{os.path.join(DB_DIR, 'academic_data.db')}"
    )

    SQLALCHEMY_TRACK_MODIFICATIONS = False
    
    # Session Configuration for CORS/credentials
    SESSION_COOKIE_SECURE = False  # Set to True in production with HTTPS
    SESSION_COOKIE_HTTPONLY = True
    SESSION_COOKIE_SAMESITE = 'None'  # Allow cross-site cookies (development)
    PERMANENT_SESSION_LIFETIME = 86400  # 24 hours
