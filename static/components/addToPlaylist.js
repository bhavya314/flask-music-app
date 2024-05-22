const AddToPlaylist=Vue.component('AddToPlaylist',{
    template:`
    <div class="text-center">
        <div>
            <h1>Your Playlists</h1>
            <table class="table table-hover" v-if='user_playlist.length!==0'>
                <thead>
                    <tr>
                        <th scope="col">Name</th>
                        <th scope="col">Dercription</th>
                        <th scope="col"></th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="playlist in user_playlist" :key='playlist.playlist_id'>
                        <td>{{ playlist.playlist_name }}</td>
                        <td>{{ playlist.describe }}</td>
                        <td>
                            <button type="button" class="btn btn-success" @click="add_to_playlist(playlist.playlist_id)">Add to Playlist</button>
                        </td>
                    </tr>
                </tbody> 
            </table>
            <h3 v-else>You have no playlist created</h3>
            <span style="text-align:center;"><button class="btn btn-primary" @click="go_back()">Go Back</button></span>
        </div>
    </div>
    `,
    computed:{
        pat_song:function(){
            return this.$store.getters.getPatSong;
        },
        user_playlist:function(){
            return this.$store.getters.getUserPlaylists;
        }
    },
    methods:{
        async add_to_playlist(playlist_id){
            try{
                if (this.user_playlist.length!==0){
                    const res=await fetch(`http://127.0.0.1:5000/add-song-to-playlist`, {
                        method:'POST',
                        headers:{
                            'Content-Type':'application/json',
                            'Authentication-Token':this.$store.getters.getAuthToken
                        },
                        body:JSON.stringify({'playlist_id':playlist_id,'song_id':this.pat_song.song_id})
                    }); 
                    const data=await res.json();
                    if(res.status===200){
                        this.$store.commit('updateUserPlaylist',data.playlist);
                        alert(data.message);
                        this.$store.commit('deletePatSong');
                        this.$router.push('/')
                    }
                    else{
                        alert(data.messaage)
                    }
                }
            }catch(error){
                console.log(`There was an error processing your request: ${error}`)
            }
        }
    }
})
export default AddToPlaylist