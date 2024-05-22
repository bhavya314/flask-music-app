from flask import request, jsonify, render_template, current_app as app, send_from_directory
from sqlalchemy import or_
from .models import db, User
from sqlalchemy import or_, and_
from .security import datastore
from .models import *
from werkzeug.security import check_password_hash, generate_password_hash
from flask_security import login_user, logout_user, auth_required, current_user, roles_required
from flask_restful import marshal, fields
from datetime import datetime
from backend import tasks
from backend.caching import cache


# creating a base route
@app.route('/',methods=['GET']) 
def home():
    # job1=tasks.daily_check.delay()
    # result1=job1.wait()
    # job2=tasks.monthly_report.delay()
    # result2=job2.wait()
    # print(result1,result2)
    return render_template('index.html')

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
role_field={
    'id':fields.Integer(),
    'name':fields.String(),
    'description':fields.String()
}
user_fields={
    'id':fields.Integer(),
    'username':fields.String(),
    'email':fields.String(),
    'roles':fields.Nested(role_field,'roles'),
    'blacklisted':fields.Boolean(),
    'songs':fields.Nested(song_field,'songs'),
    'albums':fields.Nested(album_field,'album')
}

@app.route('/all_users',methods=['GET'])
@cache.cached(10)
def all_users():
    users=User.query.all()
    if len(users)==0:
        print('no user')
        return jsonify({'message':'No user found!'}),404
    # print(marshal(users[1],user_fields))
    return ({'users':marshal(users,user_fields)}),200


@app.post('/user-login')
def user_login():
    data = request.get_json() # get the post data in JSON format
    email=data.get('email')
    if not email: #checking if email is present
        return jsonify({"message": "Email is required"}), 400
    user=datastore.find_user(email=email)
    if not user: #checking if user is present in the database
        return jsonify({"message":"User does not exist!"}),404
    if user.roles[0].name!='admin' and check_password_hash(pwhash=user.password,password=data.get("password")):
        login_user(user)
        user.current_login_at=datetime.now()
        db.session.commit()
        return jsonify({'auth_token':user.get_auth_token(),'role':user.roles[0].name,'user':marshal(user,user_fields)}),200
    else:
        return jsonify({"message":"Invalid Password!"}),401
    

@app.post('/user-register')
def user_register():
    data = request.get_json()
    email=data.get('email')
    if not email:
        return jsonify({"message": "Email is required."}),400
    username=data.get('username')
    user=User.query.filter(or_(User.username==username,User.email==email)).first()
    if user: #if there is already an account with that email or username return error
        return jsonify({"message":"A user with this Email or Username already exists."}),400
    datastore.find_or_create_role(name='user',description='User can listen to songs and create playlist')
    db.session.commit()
    if data.get('password')!=data.get('confirmPassword'):
        return jsonify({'message':'Same password required!'}),400
    new_user=datastore.create_user(username=username,email=email,password=generate_password_hash(data.get('password')), roles=["user"],current_login_at=datetime.now())
    db.session.add(new_user)
    db.session.commit()
    login_user(new_user)
    return ({'auth_token':new_user.get_auth_token(),'role':new_user.roles[0].name,'user':marshal(new_user,user_fields),'message':'User registered successfully'}),201

@auth_required('token')
@app.post('/user-register-as-creator')
def user_register_as_creator():
    data=request.get_json()
    id=data.get('id')
    user=datastore.find_user(id=id)
    if not user:
        return jsonify({"message":"No such user found."}),404
    else:
        datastore.find_or_create_role(name='creator',description='Creators can create songs and/or albums')
        datastore.remove_role_from_user(user,'user')
        datastore.add_role_to_user(user,'creator')
        db.session.commit()
        return ({'role':user.roles[0].name,'user':marshal(user,user_fields),'auth_token':user.get_auth_token(),'message':'User successfully registered as a creator!'}),201
    

@app.route('/admin-login',methods=['GET','POST'])
def admin_login():
    data = request.get_json() # get the post data in JSON format
    email=data.get('email')
    if not email: #checking if email is present
        return jsonify({"message": "Email is required"}), 400
    user=datastore.find_user(email=email)
    if not user: #checking if user is present in the database
        return jsonify({"message":"User does not exist!"}),404
    if check_password_hash(pwhash=user.password,password=data.get("password")) and user.roles[0].name=='admin':
        user.current_login_at=datetime.now()
        login_user(user)
        return jsonify({'auth_token':user.get_auth_token(),'role':user.roles[0].name,'user':marshal(user,user_fields)}),200
    else:
        return jsonify({"message":"Invalid Password!"}),401


@auth_required('token')
@app.get('/like_song/<int:song_id>')
def like_song(song_id):
    song=Songs.query.filter_by(song_id=song_id).first()
    if song:
        song.num_likes=song.num_likes+1
        song.total_likes=song.total_likes+1
        db.session.commit()
        return ({'Message':'Liked!','song':marshal(song,song_field)}),200
    
@auth_required('token')
@app.get('/dislike_song/<int:song_id>')
def dislike_song(song_id):
    song=Songs.query.filter_by(song_id=song_id).first()
    if song:
        song.num_dislikes=song.num_dislikes+1
        song.total_likes=song.total_likes+1
        db.session.commit()
        return ({'Message':'Disliked!','song':marshal(song,song_field)}),200
    
@auth_required('token')
@app.route('/search',methods=['GET','POST'])
def search():
    data=request.get_json()
    searched=data.get("query")
    songs_title=Songs.query.filter(Songs.title.like('%'+searched+'%')).all()
    songs_artist=Songs.query.filter(Songs.artist.like('%'+searched+'%')).all()
    songs_genre=Songs.query.filter(Songs.genre.like('%'+searched+'%')).all()
    albums_name=Album.query.filter(Album.album_name.like('%'+searched+'%')).all()
    albums_genre=Album.query.filter(Album.genre.like('%'+searched+'%')).all()
    albums_artist=Album.query.filter(Album.artist.like('%'+searched+'%')).all()
    return({'search':{'songs_title':marshal(songs_title,song_field),'songs_artist':marshal(songs_artist,song_field),'songs_genre':marshal(songs_genre,song_field),'albums_name':marshal(albums_name,album_field),'albums_genre':marshal(albums_genre,album_field),'albums_artist':marshal(albums_artist,album_field)}}),200


@auth_required('token')
@app.route('/add-song-to-playlist',methods=['GET','POST'])
def add_song_to_playlist():
    data=request.get_json()
    print(data)
    playlist_id=data.get('playlist_id')
    song_id=data.get('song_id')
    song_check=PlaylistSongs.query.filter(and_(PlaylistSongs.playlist_id==playlist_id,PlaylistSongs.song_id==song_id)).first()
    if song_check:
        return({'message':'The song is already is in the playlist'}),209
    else:
        new_entry=PlaylistSongs(playlist_id=playlist_id,song_id=song_id)
        db.session.add(new_entry)
        db.session.commit()
        playlist=Playlist.query.filter_by(playlist_id=playlist_id).first()
        return({'message':'The song has been added to the playlist','playlist':marshal(playlist,playlist_field)}),200
    
@auth_required('token')
@roles_required('admin')
@app.get('/blacklist_user/<int:id>')
def blacklist_user(id):
    user=User.query.filter_by(id=id).first()
    if not user:
        return({'message':'No such user exists!'}),204
    else:
        user.blacklisted=True
        db.session.commit()
        return({"message":"Blacklisted!",'user':marshal(user,user_fields)}),200

@auth_required('token')
@roles_required('admin')
@app.get('/whitelist_user/<int:id>')
def whitelist_user(id):
    user=User.query.filter_by(id=id).first()
    if not user:
        return({'message':'No such user exists!'}),204
    else:
        user.blacklisted=False
        db.session.commit()
        return({"message":"Whitelisted!",'user':marshal(user,user_fields)}),200

@auth_required('token')
@app.get('/user-logout')
def logout():
    current_user.last_login_at=datetime.now()
    db.session.commit()
    logout_user()
    return jsonify({'message':'User Logged Out!'}),200

@app.route('/serve-image/<filename>',methods=['GET','POST'])
# @cache.cached(10)
def serve_image(filename):
    return send_from_directory(app.config['UPLOADED_PHOTOS'],filename)

@app.get('/serve-audio/<filename>')
# @cache.cached(10)
def serve_audio(filename):
    return send_from_directory(app.config['UPLOADED_AUDIO_FILES'],filename)