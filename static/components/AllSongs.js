const Songs=Vue.component('Songs',{
    template:`
    <div>
        <table class="table table-hover" v-if='songs.length!==0'>
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
                <tr v-for="song in songs" :key='song.song_id'>
                    <td>{{ song.title }}</td>
                    <td>{{ song.genre }}</td>
                    <td>{{ song.artist }}</td>
                    <td>{{ song.num_likes }}</td>
                    <td>{{ song.num_dislikes }}</td>
                    <td>
                        <button type="button" class="btn btn-danger" @click="delete_song(song.song_id)">Delete</button>
                    </td>
                </tr>
            </tbody> 
        </table>
    </div>
    `,
    computed:{
        songs:function(){
            return this.$store.getters.getSongs;
        },
        role:function(){
            return this.$store.getters.getRole;
        },
        pat_song: function() {
            return this.$store.getters.getPatSong;
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
                    this.$router.push('/allsongs');
                }
            }catch(error){
                console.log(error)
            }
        }
    }
})
export default Songs;