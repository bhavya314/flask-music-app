from flask_restful import Api, reqparse, fields, marshal, Resource
from flask_security import auth_required, roles_required, current_user, roles_accepted
from flask import jsonify, request, current_app as app
from werkzeug.utils import secure_filename
import os
from backend.caching import cache
from .models import *


api=Api(prefix='/api')

#custom datetime  field for outputting dates in isoformat
class MyDateFormat(fields.Raw):
    def format(self, value):
        return value.strftime('%Y-%m-%d')


album_field={
    'album_id':fields.Integer(),
    'album_name':fields.String(),
    'genre':fields.String(),
    'artist':fields.String(),
    'release_date':MyDateFormat,
    'creator_id':fields.Integer(),
}

song_field={
    'song_id':fields.Integer(),
    "title":fields.String(),
    "lyrics":fields.String(),
    'artist':fields.String(),
    'genre':fields.String(),
    'creator_id':fields.Integer(),
    'num_likes':fields.Integer(),
    'num_dislikes':fields.Integer(),
    'album_id':fields.Integer(),
    'release_date':MyDateFormat,
    'albums':fields.Nested(album_field,'album'),
    'thumbnail_name':fields.String(),
    'audio_file_name':fields.String()
}

playlist_field={
    'playlist_id': fields.Integer(),
    'playlist_name': fields.String(),
    'user':fields.Integer(),
    'describe':fields.String(),
    'playlist_songs':fields.Nested(song_field,'songs'),
}


class SongsApi(Resource):
    @cache.cached(5)
    def get(self):
        songs= Songs.query.all()
        if len(songs)>0:
            return  ({'songs':marshal(songs,song_field)}),200
        else:
            return {'message':'No songs in the database'},204

    @auth_required('token')
    @roles_required('creator')
    def post(self):        
        title=request.form.get('title')
        lyrics=request.form.get('lyrics')
        genre=request.form.get('genre')
        album=request.form.get('album')
        thumbnail=request.files.get('thumbnail')
        audio_file=request.files.get('audio_file')
        thumbnail_name=secure_filename(thumbnail.filename)
        audio_file_name=secure_filename(audio_file.filename)
        check_song=Songs.query.filter_by(title=title).first()
        if check_song is not None:
            return ({"message":"This song already exists."}),400
        else:
            if album!='null':
                album_obj=Album.query.filter_by(album_name=album).first()
                if album_obj:
                    new_song=Songs(title=title,lyrics=lyrics,genre=genre,album_id=album_obj.album_id,creator_id=current_user.id,artist=current_user.username,thumbnail_name=thumbnail_name,audio_file_name=audio_file_name)
                    db.session.add(new_song)
                    db.session.commit()
                    db.session.add(AlbumSong(album_id=album_obj.album_id,song_id=new_song.song_id))
                    db.session.commit()
                    thumbnail.save(os.path.join(app.config['UPLOADED_PHOTOS'],thumbnail_name))
                    audio_file.save(os.path.join(app.config['UPLOADED_AUDIO_FILES'],audio_file_name))
                    return ({'song':marshal(new_song,song_field),'message':'Song added successfully!'}),201
                else:
                    new_album=Album(album_name=album,creator_id=current_user.id,artist=current_user.username,genre=genre)
                    db.session.add(new_album)
                    db.session.commit()
                    new_song=Songs(title=title, lyrics=lyrics, genre=genre, album_id=new_album.album_id, creator_id=current_user.id,artist=current_user.username,thumbnail_name=thumbnail_name,audio_file_name=audio_file_name)
                    db.session.add(new_song)
                    db.session.commit()
                    db.session.add(AlbumSong(album_id=new_album.album_id,song_id=new_song.song_id))
                    db.session.commit()
                    thumbnail.save(os.path.join(app.config['UPLOADED_PHOTOS'],thumbnail_name))
                    audio_file.save(os.path.join(app.config['UPLOADED_AUDIO_FILES'],audio_file_name))
                    return ({'song':marshal(new_song,song_field),'album':marshal(new_album,album_field),'message':'Song added successfully!'}),201
            else:
                new_song=Songs(title=title, lyrics=lyrics, genre=genre,  creator_id=current_user.id,artist=current_user.username,thumbnail_name=thumbnail_name,audio_file_name=audio_file_name)
                db.session.add(new_song)
                db.session.commit()
                thumbnail.save(os.path.join(app.config['UPLOADED_PHOTOS'],thumbnail_name))
                audio_file.save(os.path.join(app.config['UPLOADED_AUDIO_FILES'],audio_file_name))
                return ({'song':marshal(new_song,song_field),'message':'Song added successfully!'}),201
            
    @auth_required('token')
    @roles_required('creator')
    def put(self,song_id):
        current_song= Songs.query.filter_by(id=song_id).first()
        if not current_song:
            return ({"message": "Song does not exist"}),404
        else:
            if current_user.id != current_song.creator_id:
                return ({'message':'You did not create the song so you cannot update it!'}),404
            else:
                os.remove(os.path.join(app.config['UPLOADED_PHOTO'],current_song.thumbnail_name))
                os.remove(os.path.join(app.config['UPLOADED_AUDIO_FILES'],current_song.audio_file_name))
                title=request.form.get('title')
                lyrics=request.form.get('lyrics')
                genre=request.form.get('genre')
                album=request.form.get('album')
                thumbnail=request.files.get('thumbnail')
                audio_file=request.files.get('audio_file')
                thumbnail_name=secure_filename(thumbnail.filename)
                audio_file_name=secure_filename(audio_file.filename)
                if album!='null':
                    album_obj=Album.query.filter_by(album_name=album).first()
                    if album_obj:
                        current_song=Songs.query.filter_by(song_id=song_id).first()
                        current_song.title=title
                        current_song.lyrics=lyrics
                        current_song.genre=genre
                        current_song.album_id=album_obj.album_id
                        current_song.thumbnail_name=thumbnail_name
                        current_song.audio_file_name=audio_file_name
                        db.session.commit()
                        db.session.add(AlbumSong(album_id=album_obj.album_id,song_id=current_song.song_id))
                        db.session.commit()
                        thumbnail.save(os.path.join(app.config['UPLOADED_PHOTOS'],thumbnail_name))
                        audio_file.save(os.path.join(app.config['UPLOADED_AUDIO_FILES'],audio_file_name))
                        return ({'song':marshal(current_song,song_field)}),201
                    else:
                        new_album=Album(album_name=album,creator_id=current_user.id)
                        db.session.add(new_album)
                        db.session.commit()
                        current_song=Songs.query.filter_by(song_id=song_id).first()
                        current_song.title=title
                        current_song.lyrics=lyrics
                        current_song.genre=genre
                        current_song.album_id=new_album.album_id
                        current_song.thumbnail_name=thumbnail_name
                        current_song.audio_file_name=audio_file_name
                        db.session.commit()
                        db.session.add(AlbumSong(album_id=new_album.album_id,song_id=current_song.song_id))
                        db.session.commit()
                        thumbnail.save(os.path.join(app.config['UPLOADED_PHOTOS'],thumbnail_name))
                        audio_file.save(os.path.join(app.config['UPLOADED_AUDIO_FILES'],audio_file_name))
                        return ({'song':marshal(current_song,song_field),'album':marshal(new_album,album_field)}),201
                else:
                    current_song=Songs.query.filter_by(song_id=song_id).first()
                    current_song.title=title
                    current_song.lyrics=lyrics
                    current_song.genre=genre
                    current_song.thumbnail_name=thumbnail_name
                    current_song.audio_file_name=audio_file_name
                    db.session.commit()
                    thumbnail.save(os.path.join(app.config['UPLOADED_PHOTOS'],thumbnail_name))
                    audio_file.save(os.path.join(app.config['UPLOADED_AUDIO_FILES'],audio_file_name))
                    return ({'song':marshal(current_song,song_field)}),201
    
    @auth_required('token')
    @roles_accepted("admin","creator")
    def delete(self,song_id):
        song=Songs.query.filter_by(song_id=song_id).first()
        if song:
            album_songs=AlbumSong.query.filter_by(song_id=song_id).all()
            for album_song in album_songs:
                db.session.delete(album_song)
                db.session.commit()
            playlist_songs=PlaylistSongs.query.filter_by(song_id=song_id).all()
            for playlist_song in playlist_songs:
                db.session.delete(playlist_song)
                db.session.commit()
            os.remove(os.path.join(app.config['UPLOADED_PHOTOS'],song.thumbnail_name))
            os.remove(os.path.join(app.config['UPLOADED_AUDIO_FILES'],song.audio_file_name))
            db.session.delete(song)
            db.session.commit()
            return ({"song_id":song_id,'message':'Song successfully deleted!'}),200
        else:
            return ({"message": "No such song exists"}),204
        


album_parser=reqparse.RequestParser()
album_parser.add_argument('album_name', type=str, required=True)
album_parser.add_argument('genre', type=str, required=True)

class AlbumApi(Resource):
    @cache.cached(5)
    def get(self):
        albums= Album.query.all()
        albums_output=[]
        for album in albums:
            albums_output.append(marshal(album,album_field))
        return  ({'albums':albums_output})
    
    @auth_required('token')
    @roles_required('creator')
    def post(self):
        data=album_parser.parse_args()
        album_name=data.get('album_name')
        genre=data.get('genre')
        album=Album.query.filter_by(album_name=album_name).first()
        if album:
            return ({"message":"This album already exist."}),400
        else:
            if album_name and genre:
                album=Album(album_name=album_name, genre=genre, creator_id=current_user.id,artist=current_user.username)
                db.session.add(album)
                db.session.commit()
                return ({'album':marshal(album,album_field)}), 201
            else:
                return ({'message':'Album name and/or genre is not provided'}),400
            
    @auth_required('token')
    @roles_required('creator')   
    def put(self, album_id):
        #to update an existing album
        data=album_parser.parse_args()
        album_name=data.get('album_name')
        genre=data.get('genre')
        album=Album.query.filter_by(album_id=album_id).first()
        if album:
            album.album_name=album_name
            album.genre=genre
            db.session.commit()
            return ({'album':marshal(album,album_field)}),200
        else:
            return ({"message": "No such album exists"}),404  
    

    @auth_required('token')
    @roles_accepted("admin","creator")
    def delete(self, album_id):
        """Deleting a specific album using its id"""
        album_songs=AlbumSong.query.filter_by(album_id=album_id).all()
        if album_songs:
            for album_song in album_songs:
                db.session.delete(album_song)
                db.session.commit()
                song=Songs.query.filter_by(song_id=album_song.song_id).first()
                song.album_id=None
                db.session.commit()
        
        album=Album.query.filter_by(album_id=album_id).first()
        if album:
            db.session.delete(album)
            db.session.commit()
            return ({"message":"Successfully deleted the album", 'album_id': album_id}),200
        else:
            return ({"message": "No such album exists"}),204
        


playlist_parser=reqparse.RequestParser()
playlist_parser.add_argument('playlist_name', type=str, required=True)
playlist_parser.add_argument('description', type=str, required=True)

class PlaylistApi(Resource):
    @auth_required('token')
    @cache.cached(5)
    def get(self):
        playlists = Playlist.query.filter_by(user=current_user.id).all()
        if  playlists:
            # print(marshal(playlists,playlist_field))
            return ({'playlists':marshal(playlists,playlist_field),'message':'playlist of the user successfully sent'}),200
        else:
            return ({'message': 'No playlists created yet'}),204
        
    @auth_required('token')
    @roles_accepted("user","creator")
    def post(self):
        """Create a new playlist for current logged in user"""
        data=playlist_parser.parse_args()
        playlist_name=data.get("playlist_name")
        des=data.get("description")
        new_playlist=Playlist(playlist_name=playlist_name, describe=des, user=current_user.id )
        db.session.add(new_playlist)
        db.session.commit()
        return ({'playlist':marshal(new_playlist,playlist_field),'message':'New playlist has been added'}),201
    
    @auth_required('token')
    @roles_accepted("user","creator")
    def put(self,playlist_id):
        data=playlist_parser.parse_args()
        playlist_name=data.get("playlist_name")
        des=data.get("description")
        playlist=Playlist.query.filter_by(playlist_id=playlist_id).first()
        if playlist:
            playlist.playlist_name=playlist_name
            playlist.describe=des
            db.session.commit()
            return ({'playlist':marshal(playlist,playlist_field),'message':'Playlist has been updated'}),200
        else:
            return ({"message": "No such playlist exists"}),404
    
    @auth_required('token')
    @roles_accepted("user","creator")
    def delete(self,playlist_id):
        playlist_songs=PlaylistSongs.query.filter_by(playlist_id=playlist_id).all()
        if len(playlist_songs)!=0:
            for song in playlist_songs:
                db.session.delete(song)
                db.session.commit()
        playlist=Playlist.query.filter_by(playlist_id=playlist_id).first()
        db.session.delete(playlist)
        db.session.commit()
        return({'message':'Deleted Successfully','playlist_id':playlist_id}),200
        

api.add_resource(SongsApi, '/song','/song/<int:song_id>')
api.add_resource(AlbumApi, '/album', '/album/<int:album_id>')
api.add_resource(PlaylistApi,'/playlist','/playlist/<int:playlist_id>')