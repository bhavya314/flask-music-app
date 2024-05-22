const Search=Vue.component('Search',{
    template:`
    <div>
        <div class="text-center">
            <h1>Songs</h1>
            <table class="table table-hover" v-if="search_results.songs_title.length!==0 || search_results.songs_genre.length!==0 || search_results.songs_artist.length!==0">
                <thead>
                    <tr>
                        <th scope="col">Name</th>
                        <th scope="col">Genre</th>
                        <th scope="col">Artist</th>
                        <th scope="col">Likes</th>
                        <th scope="col">Dislikes</th>
                        <th scope="col"></th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="song in search_results.songs_title" :key='song.song_id'>
                        <td>{{ song.title }}</td>
                        <td>{{ song.genre }}</td>
                        <td>{{ song.artist }}</td>
                        <td>{{ song.num_likes }}</td>
                        <td>{{ song.num_dislikes }}</td>
                        <td>
                            <button type="button" class="btn btn-success" @click="view_song(song)">View Song</button>
                        </td>
                    </tr>
                    <tr v-for="song in search_results.songs_genre" :key='song.song_id'>
                        <td>{{ song.title }}</td>
                        <td>{{ song.genre }}</td>
                        <td>{{ song.artist }}</td>
                        <td>{{ song.num_likes }}</td>
                        <td>{{ song.num_dislikes }}</td>
                        <td>
                            <button type="button" class="btn btn-success" @click="view_song(song)">View Song</button>
                        </td>
                    </tr>
                    <tr v-for="song in search_results.songs_artist" :key='song.song_id'>
                        <td>{{ song.title }}</td>
                        <td>{{ song.genre }}</td>
                        <td>{{ song.artist }}</td>
                        <td>{{ song.num_likes }}</td>
                        <td>{{ song.num_dislikes }}</td>
                        <td>
                            <button type="button" class="btn btn-success" @click="view_song(song)">View Song</button>
                        </td>
                    </tr>
                </tbody> 
            </table>
            <h5 v-else>There are no songs by this keyword!</h5>

            <h1>Albums</h1>
            <table class="table table-hover" v-if="search_results.albums_name.length!==0 || search_results.albums_artist.length!==0|| search_results.albums_genre.length!==0">
                <thead>
                    <tr>
                        <th scope="col">Name</th>
                        <th scope="col">Genre</th>
                        <th scope="col">Artist</th>
                        <th scope="col"></th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="album in search_results.albums_name" :key='album.album_id'>
                        <td>{{ album.album_name }}</td>
                        <td>{{ album.genre }}</td>
                        <td>{{ album.artist }}</td>
                        <td>
                            <button type="button" class="btn btn-success" @click="show_album(album_id)">View Album</button>
                        </td>
                    </tr>
                    <tr v-for="album in search_results.albums_artist" :key='album.album_id'>
                        <td>{{ album.album_name }}</td>
                        <td>{{ album.genre }}</td>
                        <td>{{ album.artist }}</td>
                        <td>
                            <button type="button" class="btn btn-success" @click="show_album(album_id)">View Album</button>
                        </td>
                    </tr>
                    <tr v-for="album in search_results.albums_genre" :key='album.album_id'>
                        <td>{{ album.album_name }}</td>
                        <td>{{ album.genre }}</td>
                        <td>{{ album.artist }}</td>
                        <td>
                            <button type="button" class="btn btn-success" @click="show_album(album_id)">View Album</button>
                        </td>
                    </tr>
                </tbody> 
            </table>
            <h5 v-else>You have no albums by this keyword</h5>
            <br>
            <span style="text-align:center;"><button class="btn btn-primary" @click="go_back()">Go Back</button></span>
        </div>
    </div>
    `,
    computed:{
        search_results:function(){
            return this.$store.getters.getSearch
        }
    },
    methods:{
        go_back(){
            this.$store.commit('deleteSearch');
            this.$router.go(-1);
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
            
        }
    }
});
export default Search