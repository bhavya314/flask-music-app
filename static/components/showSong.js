const ShowSong=Vue.component('ShowSong',{
    template:`
    <div class="text-center">
        <div class="container d-flex justify-content-center mt-2" style="scroll;">
            <div class='row gap-2'>
                <div class="card shadow p-3 mb-5 bg-body-tertiary rounded" style="width: 36rem;">
                    <div class='card-body'>
                        <h5 class="card-title">{{ pat_song.title }}</h5>
                        <div v-if="pat_song.thumbnail_name">
                            <img :src="'/serve-image/'+pat_song.thumbnail_name" class="card-img-top"/>
                        </div>
                        <div v-if="pat_song.audio_file_name">
                            <p><audio :src="'/serve-audio/'+pat_song.audio_file_name" controls></audio></p>
                        </div>
                        <p class="card-text">{{ pat_song.lyrics }}</p>
                        <button class="btn btn-success" @click="like_song(pat_song.song_id)">Like <i class="bi bi-hand-thumbs-up-fill"></i></button>
                        <button class="btn btn-danger" @click="dislike_song(pat_song.song_id)">Dislike <i class="bi bi-hand-thumbs-down-fill"></i></button>
                        <button class="btn btn-warning" @click="add_to_playlist()">Add to Playlist <i class="bi bi-suit-heart"></i></button>
                    </div>
                    <span style="text-align:center;"><button class="btn btn-primary" @click="go_back()">Go Back</button></span>
                </div>
            </div>
        </div>
    </div>
    `,
    computed:{
        pat_song:function(){
            return this.$store.getters.getPatSong;
        }
    },
    methods:{
        async like_song(song_id){
            const res=await fetch(`http://127.0.0.1:5000/like_song/${song_id}`,{
                method:'GET',
                headers:{
                    'Authentication-Token':this.$store.getters.getAuthToken
                }
            });
            const data=await res.json()
            if(res.ok){
                this.$store.commit('updateSong',data.song);
                alert(`You liked  ${this.pat_song.title}`);
                this.$router.push('/profile');
            }
        },
        async dislike_song(song_id){
            const res=await fetch(`http://127.0.0.1:5000/dislike_song/${song_id}`,{
                method:'GET',
                headers:{
                    'Authentication-Token':this.$store.getters.getAuthToken()
                }
            });
            const data=await res.json()
            if(res.ok){
                this.$store.commit('updateSong',data.song);
                alert(`You disliked  ${this.pat_song.title}`);
                this.$router.push('/profile');
            }
        },
        add_to_playlist(){
            this.$router.push('/add-to-playlist')
        },
        go_back(){
            this.$store.commit('deletePatSong')
            this.$router.go(-1)
        }
    }
})
export default ShowSong