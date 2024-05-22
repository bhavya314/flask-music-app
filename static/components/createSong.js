const CreateSong=Vue.component('CreateSong',{
    template:`
    <div class="text-center">
        <div class='d-flex justify-content-center' v-if="pat_song===null">
            <div class="mb-3 p-5 bg-light">
                <h2 >Add a new song</h2>
                <div class='text-danger' v-if="error">*{{error}}</div>
                <label for="song-title" class="form-label">Title of the song</label>
                <input type="text" class="form-control" id="song-title" v-model="title" required>

                <label for="song-lyrics" class="form-label">Lyrics</label>
                <textarea type="text" class="form-control" id="song-lyrics" v-model="lyrics" required></textarea>

                <label for="song-genre" class="form-label">Genre</label>
                <input type="text" class="form-control" id="song-genre" v-model="genre" required>

                <label for="song-album" class="form-label">Album</label>
                <input type="text" class="form-control" id="song-album" v-model="album">

                <label for="song-file" class="form-label"> Audio File </label>
                <input type="file" class="form-control" id="song-file" ref="file" @change="upload_audio">

                <label for="thumbnail" class="form-label"> Thumbnail </label>
                <input type="file" class="form-control" id="thumbnail" name='thumbnail' ref="file" @change="upload_image">

                <button class="btn btn-primary mt-2" @click='create_song' > Create Song </button>
            </div> 
        </div>
        <div v-else class='d-flex justify-content-center'>
            <div class="mb-3 p-5 bg-light">
                <h2>Update Song</h2>
                <div class='text-danger' v-if="error">*{{error}}</div>
                <label for="song-title" class="form-label">Title of the song</label>
                <input type="text" class="form-control" id="song-title" value="pat_song.song_title" v-model="title" required>

                <label for="song-lyrics" class="form-label">Lyrics</label>
                <textarea type="text" class="form-control" id="song-lyrics" v-model="lyrics" required></textarea>

                <label for="song-genre" class="form-label">Genre</label>
                <input type="text" class="form-control" id="song-genre" v-model="genre" required>

                <label for="song-album" class="form-label">Album</label>
                <input type="text" class="form-control" id="song-album" v-model="album">

                <label for="song-file" class="form-label"> Audio File </label>
                <input type="file" class="form-control" id="song-file" ref="file" @change="upload_audio">

                <label for="thumbnail" class="form-label"> Thumbnail </label>
                <input type="file" class="form-control" id="thumbnail" name='thumbnail' ref="file" @change="upload_image">

                <button class="btn btn-primary mt-2" @click='update_song' > Update Song </button>
            </div>
        </div>
        <span style="text-align:center;"><button class="btn btn-primary" @click="go_back()">Go Back</button></span>
    </div>
    `,
    data(){
        return{
            title:null,
            lyrics:null,
            genre:null,
            album:null,
            thumbnail:null,
            audio_file:null,
            error:null
        }
    },
    computed:{
        pat_song:function(){
            return this.$store.getters.getPatSong
        }
    },
    methods:{
        upload_image(){
            this.thumbnail=this.$refs.file.files[0];
        },
        upload_audio(){
            this.audio_file=event.target.files[0];
        },
        async create_song(){
            const form_data=new FormData();
            // console.log(this.title)
            form_data.append('title',this.title)
            form_data.append('lyrics',this.lyrics)
            form_data.append('genre',this.genre)
            form_data.append('album',this.album)
            form_data.append('thumbnail',this.thumbnail,this.thumbnail.name)
            form_data.append('audio_file',this.audio_file,this.audio_file.name)
            // console.log(...form_data)
            const res=await fetch('http://127.0.0.1:5000/api/song',{
                method:'POST',
                headers:{
                    'Authentication-Token':this.$store.getters.getAuthToken
                },
                body:form_data
            });
            const data=await res.json();
            if (res.ok){
                alert(data.message);
                // console.log(data)
                this.$store.commit('addSong',data.song);
                this.$store.commit('addCurUserSong',data.song)
                if(data.album){
                    this.$store.commit('addAlbum',data.album)
                    this.$store.commit('addCurUserAlbum',data.album)
                }
                this.$router.push('/');
            }
            else{
                console.log(data);
            }
        },
        async update_song(){
            const form_data=new FormData();
            // console.log(this.title)
            form_data.append('title',this.title)
            form_data.append('lyrics',this.lyrics)
            form_data.append('genre',this.genre)
            form_data.append('album',this.album)
            form_data.append('thumbnail',this.thumbnail,this.thumbnail.name)
            form_data.append('audio_file',this.audio_file,this.audio_file.name)
            // console.log(...form_data)
            const res=await fetch(`http://127.0.0.1:5000/api/song/${this.pat_song.song_id}`,{
                method:'PUT',
                headers:{
                    'Authentication-Token':this.$store.getters.getAuthToken
                },
                body:form_data
            });
            const data=await res.json();
            if (res.ok){
                alert(data.message);
                // console.log(data)
                this.$store.commit('addSong',data.song);
                this.$store.commit('addCurUserSong',data.song)
                if(data.album){
                    this.$store.commit('addAlbum',data.album)
                    this.$store.commit('addCurUserAlbum',data.album)
                }
                this.$store.commit('deletePatSong')
                this.$router.push('/');
            }
            else{
                console.log(data);
            }
        },
        go_back(){
            this.$store.commit('deletePatSong')
            this.$router.go(-1)
        }
    }
})
export default CreateSong