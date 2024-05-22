const Profile=Vue.component('Profile',{
    template:`
    <div class="text-center">
        <div v-if="role==='creator'">
            <h1>Your Songs</h1>
            <table class="table table-hover" v-if='user_songs.length!==0'>
                <thead>
                    <tr>
                        <th scope="col">Name</th>
                        <th scope="col">Genre</th>
                        <th scope="col">Likes</th>
                        <th scope="col">Dislikes</th>
                        <th scope="col"></th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="song in user_songs" :key='song.song_id'>
                        <td>{{ song.title }}</td>
                        <td>{{ song.genre }}</td>
                        <td>{{ song.num_likes }}</td>
                        <td>{{ song.num_dislikes }}</td>
                        <td>
                            <button type="button" class="btn btn-success" @click="view_song(song)">View Song</button>
                            <button type="button" class="btn btn-primary" @click="update_song(song.song_id)">Update</button>
                            <button type="button" class="btn btn-danger" @click="delete_song(song.song_id)">Delete</button>
                        </td>
                    </tr>
                </tbody> 
            </table>
            <h3 v-else>You don't have any songs yet.</h3>
            <h1>Your Albums</h1>
            <table class="table table-hover" v-if='user_albums.length!==0'>
                <thead>
                    <tr>
                        <th scope="col">Name</th>
                        <th scope="col">Genre</th>
                        <th scope="col"></th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="album in user_albums" :key='album.album_id'>
                        <td>{{ album.album_name }}</td>
                        <td>{{ album.genre }}</td>
                        <td>
                            <button type="button" class="btn btn-success" @click="show_album(album.album_id)">View Album</button>
                            <button type="button" class="btn btn-primary" @click="update_album(album.album_id)">Update Album</button>
                            <button type="button" class="btn btn-danger" @click="delete_album(album.album_id)">Delete Album</button>
                        </td>
                    </tr>
                </tbody> 
            </table>
            <h3 v-else>You have no albums</h3>
        </div>
        <div>
            <h1>Your Playlists</h1>
            <table class="table table-hover" v-if='user_playlists.length!==0'>
                <thead>
                    <tr>
                        <th scope="col">Name</th>
                        <th scope="col">Description</th>
                        <th scope="col"></th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="playlist in user_playlists" :key='playlist.playlist_id'>
                        <td>{{ playlist.playlist_name }}</td>
                        <td>{{ playlist.describe }}</td>
                        <td>
                            <button type="button" class="btn btn-success" @click="show_playlist(playlist)">View playlist</button>
                            <button type="button" class="btn btn-primary" @click="update_playlist(playlist.playlist_id)">Update playlist</button>
                            <button type="button" class="btn btn-danger" @click="delete_playlist(playlist.playlist_id)">Delete playlist</button>
                        </td>
                    </tr>
                </tbody> 
            </table>
            <h3 v-else>You have no playlists</h3>
        </div>
        <span style="text-align:center;"><button class="btn btn-primary" @click="go_back()">Go Back</button></span>
    </div>
    `,
    computed:{
        role:function(){
            return this.$store.getters.getRole;
        },
        user_songs:function(){
            return this.$store.getters.getCurUserSongs;
        },
        user_albums:function(){
            return this.$store.getters.getCurUserAlbums;
        },
        user_playlists:function(){
            return this.$store.getters.getUserPlaylists;
        }
    },
    methods:{
        async delete_song(song_id){
            try{
                const res=await fetch(`http://127.0.0.1:5000/api/song/${song_id}`,{
                    method:'DELETE',
                    headers:{
                        'Authentication-Token':this.$store.getters.getAuthToken
                    }
                });
                const data= await res.json();
                if(res.status===200){
                    alert(data.message)
                    this.$store.commit('deleteSong',data.song_id)
                    this.$router.push('/profile');
                }
            }catch(error){
                console.log(error)
            }
        },
        go_back(){
            this.$router.go(-1)
        },
        update_song(song_id){
            let song=this.user_songs.find((item)=>item.song_id===song_id);
            this.$store.commit('setPatSong',song)
            this.$router.push('/create-song');
        },
        update_album(album_id){
            let album=this.user_albums.find((item)=>item.album_id===album_id);
            this.$store.commit('setPatAlbum',album)
            this.$router.push('/create-album');
        },
        update_playlist(playlist_id){
            let playlist=this.user_playlists.find((item)=>item.playlist_id===playlist_id);
            this.$store.commit('setPatPlaylist',playlist)
            this.$router.push('/create-playlist');
        },
        view_song(song){
            this.$store.commit('setPatSong',song);
            this.$router.push('/show_song')
        },
        show_album(album_id){
            const album=this.user_albums.filter((x)=>x.album_id===album_id)
            this.$store.commit('setCurAlbumSongs',album_id);
            this.$store.commit('setPatAlbum',album);
            this.$router.push('/show-songs')
            
        },
        show_playlist(playlist){
            this.$store.commit('setPatPlaylist',playlist);
            this.$router.push("/show-songs");
        },
        async delete_album(album_id){
            try{
                const res=await fetch(`http://127.0.0.1:5000/api/album/${album_id}`,{
                    method:'DELETE',
                    headers:{
                        'Authentication-Token':this.$store.getters.getAuthToken
                    }
                });
                const data= await res.json();
                if(res.status===200){
                    alert(data.message)
                    this.$store.commit('deleteAlbum',data.album_id)
                    this.$router.push('/profile');
                }
            }catch(error){
                console.log(error)
            }
        },
        async delete_playlist(playlist_id){
            try{
                const res=await fetch(`http://127.0.0.1:5000/api/playlist/${playlist_id}`,{
                    method:'DELETE',
                    headers:{
                        'Authentication-Token':this.$store.getters.getAuthToken
                    }
                });
                const data= await res.json();
                if(res.status===200){
                    alert(data.message)
                    this.$store.commit('deletePlaylist',data.playlist_id)
                    this.$router.push('/profile');
                }
            }catch(error){
                console.log(error)
            }
        }  
    }
})
export default Profile