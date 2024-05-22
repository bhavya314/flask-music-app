from .mail_service import send_message
from .models import *
from jinja2 import Template
from celery.schedules import crontab
from .workers import celery
from datetime import timedelta,datetime


@celery.task
def daily_check():
    users = User.query.filter(User.roles.any(Role.name != 'admin')).all()
    for user in users:
        if (datetime.now()-user.last_login_at)>timedelta(hours=24):
            with open('daily_reminder.html', 'r') as f:
                template = Template(f.read())
                send_message(user.email, 'Daily Reminder',
                             template.render(user=user))
    return "OK"


@celery.task
def monthly_report():
    creators = User.query.filter(User.roles.any(Role.name == 'creator')).all()
    for creator in creators:
        user_songs,user_albums=[],[]
        for album in creator.albums:
            if (datetime.now()-album.release_date)<timedelta(days=30):
                user_albums.append(album)
        for song in creator.songs:
            if (datetime.now()-song.release_date)<timedelta(days=30):
                user_songs.append(song)
        with open('monthly_report.html', 'r') as f:
            template = Template(f.read())
            send_message(creator.email, 'Monthly Report',
                         template.render(creator=creator,user_songs=user_songs,user_albums=user_albums))
            


@celery.on_after_configure.connect
def setup_periodic_tasks(sender,**kwargs):
    sender.add_periodic_task(
        crontab(hour='11',minute='46'),
        daily_check.s()
    )
    sender.add_periodic_task(
        crontab(hour='11',minute='46'),
        monthly_report.s()
    )