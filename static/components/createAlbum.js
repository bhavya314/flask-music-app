const CreateAlbum=Vue.component('CreateAlbum',{
    template:`
    <div class="text-center">
        <div class='d-flex justify-content-center' style="margin-top: 25vh" v-if="pat_album===null">
            <div class="mb-3 p-5 bg-light">
                <div class='text-danger' v-if="error">*{{error}}</div>
                <label for="album-name" class="form-label">Name of the Album</label>
                <input type="text" class="form-control" id="album-name" v-model="credentials.album_name" required>
                <label for="genre" class="form-label">Genre</label>
                <input type="text" class="form-control" id="genre" v-model="credentials.genre" required>
                <button class="btn btn-primary mt-2" @click='create_album' > Create Album </button>
            </div> 
        </div>
        <div class='d-flex justify-content-center' style="margin-top: 25vh" v-else>
            <div class="mb-3 p-5 bg-light">
                <div class='text-danger' v-if="error">*{{error}}</div>
                <label for="album-name" class="form-label">Name of the Album</label>
                <input type="text" class="form-control" id="album-name" v-model="credentials.album_name" required>
                <label for="genre" class="form-label">Genre</label>
                <input type="text" class="form-control" id="genre" v-model="credentials.genre" required>
                <button class="btn btn-primary mt-2" @click='update_album' > Update Album </button>
            </div> 
        </div>
        <span style="text-align:center;"><button class="btn btn-primary" @click="go_back()">Go Back</button></span>
    </div>
    `,
    data(){
        return {
            credentials:{
                album_name:null,
                genre:null,
                // artist:this.$store.getter.getCurrentUser.username
            },
            error:null
        }
    },
    computed:{
        pat_album:function(){
            return this.$store.getters.getPatAlbum;
        }
    },
    methods:{
        async create_album(){
            const res=await fetch('http://127.0.0.1:5000/api/album',{
                method:'POST',
                headers:{'Content-Type':'application/json',
                    'Authentication-Token':this.$store.getters.getAuthToken
                },
                body:JSON.stringify(this.credentials)
            });
            const data=await res.json();
            if(res.ok){
                alert(data.message)
                this.$store.commit('addAlbum',data.album);
                this.$store.commit('addCurUserAlbum',data.album);
                this.$router.push('/');
            }
            else{
                this.error=data.message;
            }
        },
        async create_album(){
            const res=await fetch(`http://127.0.0.1:5000/api/album/${this.pat_album.album_id}`,{
                method:'PUT',
                headers:{
                    'Content-Type':'application/json',
                    'Authentication-Token':this.$store.getters.getAuthToken
                },
                body:JSON.stringify(this.credentials)
            });
            const data=await res.json();
            if(res.ok){
                alert(data.message)
                this.$store.commit('updateAlbum',data.album);
                this.$router.push('/profile');
            }
            else{
                this.error=data.message;
            }
        },
        go_back(){
            this.$store.commit('deletePatAlbum')
            this.$router.go(-1)
        }
    }
})
export default CreateAlbum