from flask import Flask
from backend.models import *
from flask_security import Security
from werkzeug.security import generate_password_hash
from backend.resources import api
from backend.config import DevelopmentConfig
from celery.schedules import crontab
from flask_cors import CORS
from backend import workers
from backend.security import datastore
from backend.caching import cache

def create_app():
    app = Flask(__name__)
    app.config.from_object(DevelopmentConfig)
    db.init_app(app)
    with app.app_context():
        db.create_all()
    api.init_app(app)
    app.security = Security(app, datastore)
    celery=workers.celery
    celery.conf.update(
        broker_url=app.config["CELERY_BROKER_URL"],
        result_backend=app.config["CELERY_RESULT_BACKEND"],
        broker_connection_retry_on_startup=app.config['BROKER_CONNECTION_RETRY_ON_STARTUP'],
        enable_utc=False,
        timezone='Asia/Kolkata'
    )
    celery.Task=workers.ContextTask
    with app.app_context():
        app.security.datastore.find_or_create_role(name="admin", description="Admin")
        db.session.commit()
        if not app.security.datastore.find_user(email="test@me.com"):
            app.security.datastore.create_user(email="test@me.com", username='admin', password=generate_password_hash("password"), roles=["admin"])
        db.session.commit()
    cache.init_app(app)
    app.app_context().push()
    with app.app_context():
        import backend.controllers
    return app,celery

app,celery=create_app()


if __name__=='__main__':
    app.run(debug=True)