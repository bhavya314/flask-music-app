const CreatePlaylist=Vue.component('CreatePlaylist',{
    template:`
    <div class="text-center">
        <div class='d-flex justify-content-center' style="margin-top: 25vh" v-if="pat_playlist===null">
            <div class="mb-3 p-5 bg-light">
                <div class='text-danger' v-if="error">*{{error}}</div>
                <label for="playlist-name" class="form-label">Name of the Playlist</label>
                <input type="text" class="form-control" id="playlist-name" v-model="credentials.playlist_name" required>
                <label for="description" class="form-label">Description</label>
                <input type="text" class="form-control" id="description" v-model="credentials.description" required>
                <button class="btn btn-primary mt-2" @click='create_playlist' > Create Playlist </button>
            </div> 
        </div>
        <div class='d-flex justify-content-center' style="margin-top: 25vh" v-else>
            <div class="mb-3 p-5 bg-light">
                <div class='text-danger' v-if="error">*{{error}}</div>
                <label for="playlist-name" class="form-label">Name of the Playlist</label>
                <input type="text" class="form-control" id="playlist-name" v-model="credentials.playlist_name" required>
                <label for="description" class="form-label">Description</label>
                <input type="text" class="form-control" id="description" v-model="credentials.description" required>
                <button class="btn btn-primary mt-2" @click='update_playlist' > Update Playlist </button>
            </div>
        </div>
        <span style="text-align:center;"><button class="btn btn-primary" @click="go_back()">Go Back</button></span>
    </div>
    `,
    data(){
        return{
            credentials:{
                playlist_name:null,
                description:null
            },
            error:null
        }
    },
    computed:{
        pat_playlist:function(){
            return this.$store.getters.getPatPlaylist;
        }
    },
    methods:{
        async create_playlist(){
            const res=await fetch('http://127.0.0.1:5000/api/playlist',{
                method:'POST',
                headers:{
                    'Content-Type':'application/json',
                    'Authentication-Token':this.$store.getters.getAuthToken
                },
                body:JSON.stringify(this.credentials)
            });
            const data=await res.json();
            if(res.ok){
                alert(data.message);
                this.$store.commit('addPlaylist',data.playlist);
                this.$router.push('/');
            }
            else{
                this.error=data.error;
            }
        },
        async update_playlist(){
            const res=await fetch(`http://127.0.0.1:5000/api/playlist/${this.pat_playlist.playlist_id}`,{
                method:'PUT',
                headers:{
                    'Content-Type':'application/json',
                    'Authentication-Token':this.$store.getters.getAuthToken
                },
                body:JSON.stringify(this.credentials)
            });
            const data=await res.json();
            if(res.ok){
                alert(data.message);
                this.$store.commit('updateUserPlaylist',data.playlist);
                this.$router.push('/profile');
            }
            else{
                this.error=data.error;
            }
        },
        go_back(){
            this.$store.commit('deletePatPlaylist')
            this.$router.go(-1)
        }
    }
})
export default CreatePlaylist