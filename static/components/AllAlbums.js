const Albums=Vue.component('Albums',{
    template:`
    <div>
        <table class="table table-hover" v-if='albums.length!==0'>
            <thead>
                <tr>
                    <th scope="col">Name</th>
                    <th scope="col">Genre</th>
                    <th scope="col">Artist</th>
                    <th scope="col"></th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="album in albums" :key='album.album_id'>
                    <td>{{ album.album_name }}</td>
                    <td>{{ album.genre }}</td>
                    <td>{{ album.artist }}</td>
                    <td>
                        <button type="button" class="btn btn-danger" @click="delete_album(album.album_id)">Delete Album</button>
                    </td>
                </tr>
            </tbody> 
        </table>
    </div>
    `,
    computed:{
        albums: function(){ 
            return this.$store.getters.getAlbums
        }
    },
    methods:{
        async delete_album(album_id){
            try{
                const res=await fetch(`http://127.0.0.1:5000/api/album/${album_id}`, {method:'DELETE',headers:{
                    'Authentication-Token':this.$store.getters.getAuthToken
                }}
                )
                const data= await res.json();
                if(res.status===200){
                    alert(data.message)
                    this.$store.commit("deleteAlbum",data.album_id);
                    this.$router.push('/allalbums');
                }else{
                    alert(data.message)
                }
            }catch(error){
                console.log(error)
            }
        }
    }
})
export default Albums;