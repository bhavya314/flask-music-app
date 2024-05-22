
const store=new Vuex.Store({
    state:{
        songs:[],
        albums:[],
        current_user:null,
        all_users:[],
        role:null,
        auth_token:null,
        pat_song:null,
        cur_user_songs:[],
        cur_user_albums:[],
        album_songs:[],
        pat_album:null,
        pat_playlist:null,
        user_playlists:[],
        search:null
    },
    getters:{
        getSongs:function(state){
            return state.songs;
        },
        getAlbums:function(state){
            return state.albums;
        },
        getCurrentUser:function(state){
            return state.current_user;
        },
        getAllUsers:function(state){
            return state.all_users;
        },
        getRole:function(state){
            return state.role;
        },
        getAuthToken:function(state){
            return state.auth_token;
        },
        getPatSong:function(state){
            return state.pat_song;
        },
        getPatAlbum:function(state){
            return state.pat_album;
        },
        getPatPlaylist:function(state){
            return state.pat_playlist;
        },
        getCurUserSongs: function (state) {
            return state.cur_user_songs;
        },
        getCurUserAlbums: function(state){
            return  state.cur_user_albums;
        },
        getCurAlbumSongs: function(state){
            return  state.album_songs;
        },
        getUserPlaylists:function(state){
            return state.user_playlists;
        },
        getSearch:function(state){
            return state.search
        }
    },
    mutations:{
        setAllUsers(state,users){
            state.all_users=users
        },
        setUser(state,user){
            state.current_user = user;
        },
        setSongs(state,songs){
            state.songs=songs;
        },
        setAlbums(state, albums){
            state.albums=albums;
        },
        setRole(state, role){
            state.role=role;
        },
        setAuthToken(state, auth_token){
            state.auth_token=auth_token;
        },
        setPatSong(state,song){
            state.pat_song=song;
        },
        setPatAlbum(state,album){
            state.pat_album=album;
        },
        setPatPlaylist(state,playlist){
            state.pat_playlist=playlist;
        },
        setCurUserAlbums(state){
            state.cur_user_albums=state.albums.filter((x)=>x.creator_id===state.current_user.id);
        },
        setCurUserSongs(state){
            state.cur_user_songs=state.songs.filter((x)=>x.creator_id===state.current_user.id);
        },
        setCurAlbumSongs(state,album_id){
            state.album_songs=state.songs.filter((x)=>x.album_id===album_id);
        },
        setUserPlaylists(state,playlists){
            state.user_playlists=playlists;
        },
        setSearch:function(state,search){
            state.search=search;
        },
        addSong(state,song){
            state.songs.push(song);
        },
        addCurUserSong(state,song){
            state.cur_user_songs.push(song);
        },
        addCurUserAlbum(state,album){
            state.cur_user_albums.push(album)
        },
        addUser(state,user){
            state.songs.push(user);
        },
        addPlaylist(state,playlist){
            state.user_playlists.push(playlist)
        },
        addAlbum(state,album){
            state.albums.push(album);
        },
        updateSong(state,song){
            const index=state.songs.findIndex((item)=> item.song_id===song.song_id)
            if (index!==-1){
                state.songs.splice(index,1,song);
            }
        },
        updateAlbum(state,album){
            const index=state.albums.findIndex((item)=> item.album_id===album.album_id)
            if (index!==-1){
                state.albums.splice(index,1,album);
            }
        },
        updateUser(state,user){
            const index=state.all_users.findIndex((item)=> item.id===user.id)
            if (index!==-1){
                state.all_users.splice(index,1,user);
            }
        },
        updateUserPlaylist(state,playlist){
            const index=state.user_playlists.findIndex((item)=> item.playlist_id===playlist.playlist_id);
            if(index!==-1){
                state.user_playlists.splice(index,1,playlist);
            }
        },
        deleteSong(state,song_id){
            state.songs=state.songs.filter(m=>m.song_id!==song_id);
        },
        deleteAlbum(state,album_id){
            state.albums=state.albums.filter(m=>m.album_id!==album_id);
        },
        deletePlaylist(state,playlist_id){
            state.user_playlists=state.user_playlists.filter(m=>m.playlist_id!==playlist_id);
        },
        deleteRole(state){
            state.role=null;
        },
        deleteAuthToken(state){
            state.auth_token=null;
        },
        deleteCurrentUser(state){
            state.current_user=null;
        },
        deletePatSong(state){
            state.pat_song=null;
        },
        deletePatAlbum(state){
            state.pat_album=null;
        },
        deletePatPlaylist(state){
            state.pat_playlist=null;
        },
        deleteCurUserSongs(state){
            state.cur_user_albums=[];
        },
        deleteCurAlbumSongs(state){
            state.album_songs=[];
        },
        deleteCurUserAlbums(state){
            state.cur_user_albums=[];
        },
        deleteUserPlaylists(state){
            state.user_playlists=[];
        },
        logout(state){
            state.auth_token=null,
            state.role=null,
            state.current_user=null,
            state.cur_user_songs=[],
            state.cur_user_albums=[],
            state.user_playlists=[],
            state.pat_album=null,
            state.pat_playlist=null,
            state.album_songs=[],
            state.search=null,
            state.pat_song=null
        },
        deleteSearch:function(state){
            state.search=null;
        }
    },
    actions:{
        async getSongs({commit}){
            try{
                const res= await fetch('http://127.0.0.1:5000/api/song',{
                    method:'GET'
                })
                if(res.ok){
                    const data=await res.json();
                    for(const song of data.songs){
                        commit('addSong',song);
                    }
                }
                else {
                    console.log(`Error! ${res.status}`);
                }
            }
            catch(error){
                    alert(`There was an error processing your request: ${error}`)
            }
        },// end of getSongs
        async getAlbums({commit}){
            try{
                const res= await fetch('http://127.0.0.1:5000/api/album',{
                    method:'GET'
                })
                if(res.ok){
                    const data=await res.json();
                    for(const album of data.albums){
                        commit('addAlbum',album);
                    }
                }
                else {
                    console.log(`Error! ${res.status}`);
                }
            }
            catch(error){
                alert(`There was an error processing your request: ${error}`)
            }
        },//end of getAlbums
        async getUsers({commit}){
            try{
                const res=await fetch('http://127.0.0.1:5000/all_users')
                const data=await res.json()
                if (res.ok){
                    commit('setAllUsers',data.users)
                }
                else{
                    console.log(`Error! ${res.status}`);
                }
            }
            catch(error){
                console.log('not fetched')
                console.log(`Error in getting users :${error}`)
            }
        },//end of getUsers
        async getPlaylist({commit},auth_token){
            try{
                const res=await fetch('http://127.0.0.1:5000/api/playlist',{
                    method:"GET",
                    headers:{
                        'Authentication-Token':auth_token
                    }
                })
                const data=await res.json()
                if(res.status===200){
                    commit("setUserPlaylists",data.playlists);
                }else{
                    console.log(`Error! ${data.message}`);
                }
            }
            catch(error){
                console.log('not fetched')
                console.log(`Error in getting users :${error}`)
            }
        }//end of getUserPlaylist
    }
})
export default store;