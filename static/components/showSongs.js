const ShowSongs=Vue.component('ShowSongs',{
    template:`
    <div class="text-center">
        <div v-if="pat_album!==null">
            <h1>Your Songs</h1>
            <table class="table table-hover" v-if='album_songs.length!==0'>
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
                    <tr v-for="song in album_songs" :key='song.song_id'>
                        <td>{{ song.title }}</td>
                        <td>{{ song.genre }}</td>
                        <td>{{ song.num_likes }}</td>
                        <td>{{ song.num_dislikes }}</td>
                        <td>
                            <button type="button" class="btn btn-success" @click="view_song(song)">View Song</button>
                        </td>
                    </tr>
                </tbody> 
            </table>
            <span style="text-align:center;"><button class="btn btn-primary" @click="go_back()">Go Back</button></span>
            <h3 v-else>There are no songs in this album.</h3>
        </div>
        <div v-if="pat_playlist!==null">
            <h1>Your Songs</h1>
            <table class="table table-hover" v-if='user_playlist.length!==0'>
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
                    <tr v-for="song in pat_playlist.playlist_songs" :key='song.song_id'>
                        <td>{{ song.title }}</td>
                        <td>{{ song.genre }}</td>
                        <td>{{ song.num_likes }}</td>
                        <td>{{ song.num_dislikes }}</td>
                        <td>
                            <button type="button" class="btn btn-success" @click="view_song(song)">View Song</button>
                        </td>
                    </tr>
                </tbody> 
            </table>
            <span style="text-align:center;"><button class="btn btn-primary" @click="go_back()">Go Back</button></span>
            <h3 v-else>There are no songs in this playlist.</h3>
        </div>
    </div>
    `,
    computed:{
        pat_album:function(){
            return this.$store.getters.getPatAlbum;
        },
        pat_playlist:function(){
            return this.$store.getters.getPatPlaylist;
        },
        album_songs:function(){
            return this.$store.getters.getCurAlbumSongs;
        },
        user_playlist:function(){
            return this.$store.getters.getUserPlaylists;
        }
    },
    methods:{
        view_song(song){
            this.$store.commit('setPatSong',song)
            this.$router.push('/show_song')
        },
        go_back(){
            // this.$store.commit('deletePatSong')
            this.$store.commit('deletePatAlbum')
            this.$store.commit('deleteCurAlbumSongs')
            this.$store.commit('deletePatPlaylist')
            this.$router.go(-1)
        }
    }
    
});
export default ShowSongs
