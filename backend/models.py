from flask_sqlalchemy import SQLAlchemy
from flask_security import UserMixin, RoleMixin

db=SQLAlchemy()
''' creating the models'''

class RolesUsers(db.Model):
    __tablename__ = 'roles_users'
    id = db.Column(db.Integer(), primary_key=True)
    user_id = db.Column('user_id', db.Integer(), db.ForeignKey('user.id'))
    role_id = db.Column('role_id', db.Integer(), db.ForeignKey('role.id'))

class User(db.Model, UserMixin):
    __tablename__='user'
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String, unique=True,nullable=False)
    email = db.Column(db.String, unique=True)
    password = db.Column(db.String(255))
    blacklisted=db.Column(db.Boolean(),default=False) # if true user is blocked by admin
    last_login_at = db.Column(db.DateTime())
    current_login_at = db.Column(db.DateTime())
    last_login_ip = db.Column(db.String(100))
    current_login_ip = db.Column(db.String(100))
    login_count = db.Column(db.Integer())
    active = db.Column(db.Boolean())
    fs_uniquifier = db.Column(db.String(255), unique=True, nullable=False)
    confirmed_at = db.Column(db.DateTime())
    roles = db.relationship('Role', secondary='roles_users',backref=db.backref('users', lazy='dynamic'))
    songs=db.relationship('Songs',backref=db.backref('songs',lazy=True))
    albums=db.relationship('Album',backref=db.backref('album',lazy=True))
    
class Role(db.Model, RoleMixin):
    id = db.Column(db.Integer(), primary_key=True)
    name = db.Column(db.String(80), unique=True)
    description = db.Column(db.String(255))


# Songs Model
class Songs(db.Model):
    __tablename__='songs'
    __searchable__=['title','artist_name','genre']
    song_id=db.Column(db.Integer(),primary_key=True,autoincrement=True)
    title=db.Column(db.String(50),nullable=False,unique=True)
    lyrics=db.Column(db.String(50000),nullable=False)
    artist=db.Column(db.String(),nullable=False)
    genre=db.Column(db.String(30),nullable=False)
    num_likes=db.Column(db.Integer(),default=0)
    num_dislikes=db.Column(db.Integer(),default=0)
    total_likes=db.Column(db.Integer(),default=0)
    release_date=db.Column(db.TIMESTAMP,server_default=db.text('(CURRENT_TIMESTAMP)'), nullable=False)
    thumbnail_name=db.Column(db.String(),nullable=True)
    audio_file_name=db.Column(db.String(),nullable=True)
    album_id=db.Column(db.Integer(),db.ForeignKey('album.album_id'),nullable=True)
    creator_id=db.Column(db.Integer(),db.ForeignKey('user.id'),nullable=False)
    albums=db.relationship('Album',secondary='album_songs', backref=db.backref('songs'))


# Album Model
class Album(db.Model):
    __tablename__='album'
    __searchable__=['album_name']
    album_id=db.Column(db.Integer(),primary_key=True,autoincrement=True)
    album_name=db.Column(db.String(50),nullable=False,unique=True)
    artist=db.Column(db.String(),nullable=False)
    genre=db.Column(db.String(),nullable=True)
    release_date=db.Column(db.TIMESTAMP,server_default=db.text('(CURRENT_TIMESTAMP)'), nullable=False)
    creator_id=db.Column(db.Integer(),db.ForeignKey('user.id'),nullable=False)


class AlbumSong(db.Model):
    __tablename__="album_songs"
    id=db.Column(db.Integer(), primary_key=True, autoincrement=True)
    album_id=db.Column(db.Integer(),db.ForeignKey("album.album_id"))
    song_id=db.Column(db.Integer(),db.ForeignKey("songs.song_id"))



# Playlist Model
class Playlist(db.Model):
    __tablename__ = 'playlist'
    user=db.Column(db.Integer(),
                   db.ForeignKey('user.id'),
                   nullable=False)
    playlist_id=db.Column(db.Integer(),primary_key=True,autoincrement=True)
    playlist_name=db.Column(db.String(50),nullable=False, unique=True)
    describe=db.Column(db.String(60),nullable=False)
    playlist_songs=db.relationship('Songs',secondary='playlist_songs', backref=db.backref('playlist'))


class PlaylistSongs(db.Model):
    __tablename__="playlist_songs"
    id=db.Column(db.Integer(), primary_key=True, autoincrement=True)
    playlist_id=db.Column(db.Integer(),db.ForeignKey("playlist.playlist_id"))
    song_id=db.Column(db.Integer(),db.ForeignKey("songs.song_id"))