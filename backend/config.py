class Config(object):
    DEBUG = False
    TESTING = False
    CELERY_BROKER_URL="redis://localhost:6379/1"
    CELERY_RESULT_BACKEND="redis://localhost:6379/2"


class DevelopmentConfig(Config):
    DEBUG = True
    SQLALCHEMY_DATABASE_URI = 'sqlite:///database.db'
    SECRET_KEY = "thisissecter"
    SECURITY_PASSWORD_SALT = "thisissaltt"
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SECURITY_TRACKABLE=True
    SECURITY_REGISTERABLE=True
    SECURITY_CONFRIMABLE=False
    SECURITY_SEND_REGISTER_EMAIL=False
    SECURITY_UNAUTHORIZED_VIEW=None
    WTF_CSRF_ENABLED = False  # disable CSRF for now since we don't have a session yet
    SECURITY_TOKEN_AUTHENTICATION_HEADER = 'Authentication-Token'
    CACHE_TYPE = "RedisCache"
    CACHE_REDIS_HOST = "localhost"
    CACHE_REDIS_PORT = 6379
    CACHE_REDIS_DB = 3
    BROKER_CONNECTION_RETRY_ON_STARTUP=True
    REDIS_URL = "redis://localhost:6379"
    CELERY_BROKER_URL="redis://localhost:6379/1"
    CELERY_RESULT_BACKEND="redis://localhost:6379/2"
    UPLOADED_PHOTOS='flask-music-app/static/thumbnails'
    UPLOADED_AUDIO_FILES='flask-music-app/static/audio files'
