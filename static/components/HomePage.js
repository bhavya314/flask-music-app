
const Home=Vue.component('Home',{
    template:`
    <div class="text-center">
        <div v-if="role!=='admin'">
            <div v-if='current_user===null || current_user.blacklisted===false'>
                <h1 v-if='role===null' style='text-align:center;'>Music Streamings App</h1>
                <p v-if='role===null' style='text-align:center;'>Welcome to our music streaming app! We have a wide variety of songs for you to listen to.</p>
                <div>
                    <div class="container d-flex justify-content-center mt-2" style="scroll;">
                        <div class="row gap-2">
                            <div class="card shadow p-3 mb-5 bg-body-tertiary rounded" style="width: 18rem;" v-for="song in songs" :key='song.song_id'>
                                <div v-if="song.thumbnail_name">
                                    <img :src="'/serve-image/'+song.thumbnail_name" class="card-img-top"/>
                                </div>
                                <div class='card-body'>
                                    <h5 class="card-title">{{ song.title }}</h5>
                                    <p class="card-text">By: {{ song.artist }}</p>
                                    <p class="card-text" style="word-wrap:normal;">{{ song.lyrics.slice(0,50) }}...</p>
                                    <button class="btn btn-primary" @click="show_song(song.song_id)">Read More</button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="container d-flex justify-content-center mt-2" style="scroll;">
                        <div class="row gap-2">
                            <div class="card shadow p-3 mb-5 bg-body-tertiary rounded" style="width: 18rem;" v-for="album in albums" :key='album.album_id'>
                                <div class='card-body'>
                                    <h5 class="card-title">{{ album.album_name }}</h5>
                                    <p class="card-text" >By: {{ album.artist }}</p>
                                    <button class="btn btn-primary" @click="show_album(album.album_id)">Show Songs in the album</button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div v-if='user_playlists'>
                        <div class="container d-flex justify-content-center mt-2" style="scroll;">
                            <div class="row gap-2">
                                <div class="card shadow p-3 mb-5 bg-body-tertiary rounded" style="width: 18rem;"  v-for="playlist in user_playlists" :key='playlist.playlist_id'>
                                    <div class='card-body'>
                                        <h5 class="card-title">{{ playlist.playlist_name }}</h5>
                                        <p class="card-text" >{{ playlist.describe }}</p>
                                        <button class="btn btn-primary" @click="show_playlist(playlist)">Show Songs in the Playlist</button>
                                    </div>
                                </div>
                            </div>
                        </div>  
                    </div>
                    <div v-else>
                        <h3>You have not created any playlists. Create one now!</h3>
                    </div>
                </div>
            </div>
            <div v-else>
                <h1 style='text-align:center;'>You have been blacklisted. Please contact the admin.</h1>
            </div>
        </div>
        <div v-else-if="role==='admin'">
            <div class="container">
                <h1 class="text-center mt-5">Creator Administrator Dashboard</h1>

                <div class="row">
                    <div class="col-md-6">
                        <h3>Creators</h3>
                        <p>Total Users: {{ users.length }}</p>
                        <p>Total Creators: {{ creators.length }}</p>
                    </div>
                    <div class="col-md-6">
                        <h3>App Performance</h3>
                        <p>Tracks: {{ all_songs }}</p>
                        <p>Total Albums: {{ all_albums }}</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
    `,
    computed:{
        songs:function(){
            return this.$store.getters.getSongs;
        },
        role:function(){
            return this.$store.getters.getRole;
        },
        albums:function(){
            return this.$store.getters.getAlbums;
        },
        user_playlists:function(){
            return this.$store.getters.getUserPlaylists;
        },
        users:function(){
            return this.$store.getters.getAllUsers.filter((item)=>item.roles[0].name!=='admin');
        },
        creators:function(){
            return this.$store.getters.getAllUsers.filter((item)=>item.roles[0].name==='creator');
        },
        all_songs:function(){
            return this.$store.getters.getSongs.length;
        },
        all_albums:function(){
            return this.$store.getters.getAlbums.length;
        },
        current_user:function(){
            return this.$store.getters.getCurrentUser
        }
    },
    methods:{
        show_song(song_id){
            if (this.role){
                for(const song of this.songs){
                    if (parseInt(song.song_id) === parseInt(song_id)) {
                        this.$store.commit('setPatSong',song);
                        this.$router.push('/show_song') 
                        break;
                    }
                }
            }
            else{
                alert("Please log in to view the full lyrics.");
                this.$router.push('/user-login');
            }
            
        },
        show_album(album_id){
            if(this.role){
                const album=this.$store.getters.getAlbums.filter((x)=>x.album_id===album_id)
                this.$store.commit('setCurAlbumSongs',album_id);
                this.$store.commit('setPatAlbum',album);
                this.$router.push("/show-songs");
            }
            else{
                alert('Please login  to see more information about this album!')
                this.$router.push('/user-login');
            }
        },
        show_playlist(playlist){
            if(this.role){
                this.$store.commit('setPatPlaylist',playlist);
                this.$router.push("/show-songs");
            }
            else{
                alert('Please login  to see more information about this album!')
                this.$router.push('/user-login');
            }
        }
    }
})
export default Home