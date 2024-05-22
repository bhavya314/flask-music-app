import Login from './components/Login.js'
import Home from './components/HomePage.js'
import Navbar from './components/Navbar.js'
import RegisterAsUser from './components/RegisterAsUser.js'
import CreateSong from  "./components/createSong.js";
import CreateAlbum from './components/createAlbum.js';
import Profile from  './components/profile.js';
import ShowSong from './components/showSong.js';
import CreatePlaylist from './components/createPlaylist.js';
import ShowSongs from './components/showSongs.js';
import AddToPlaylist from './components/addToPlaylist.js';
import AdminLogin from './components/adminLogin.js';
import Albums from './components/AllAlbums.js';
import Songs from './components/AllSongs.js';
import Users from './components/AllUsers.js';
import Search from './components/search.js';
import store from './store/index.js';

const route=[
    {
        path:'/user-login',
        component:Login,
        name:'Login'
    },
    {
        path:'/',
        component:Home,
        name:'HomePage'
    },
    {
        path:'/user-register',
        component:RegisterAsUser,
        name:'RegisterAsUser'
    },
    {
        path:'/create-song',
        component:CreateSong,
        name:"CreateSong",
    },
    {
        path:'/profile',
        component:Profile,
        name:'Profile'
    },
    {
        path:'/create-album',
        component:CreateAlbum,
        name:'CreateAlbum'
    },
    {
        path:'/show_song',
        component:ShowSong,
        name:'ShowSong'
    },
    {
        path:'/create-playlist',
        component:CreatePlaylist,
        name:'CreatePlaylist'
    },
    {
        path:'/show-songs',
        component:ShowSongs,
        name:'ShowSongs'
    },
    {
        path:'/add-to-playlist',
        component:AddToPlaylist,
        name:'AddToPlaylist'
    },
    {
        path:'/admin-login',
        component:AdminLogin,
        name: 'AdminLogin'
    },
    {
        path:'/allalbums',
        component:Albums,
        name:'AllAlbums'
    },
    {
        path:'/allsongs',
        component:Songs, 
        name:'AllSongs'
    },
    {
        path:'/users',
        component:Users,
        name:'Users'
    },
    {
        path:'/search-results',
        component:Search,
        name:'Search'
    }
]
const router = new VueRouter({routes:route});

router.beforeEach((to, from, next) => {
    if (to.name !== 'Login' && store.getters.getAuthToken===null ? true : false){
        if (to.name === 'RegisterAsUser')
            next()
        else if (to.name === 'HomePage')
            next()
        else if(to.name==='AdminLogin')
            next()
        else{
            next({ name: 'Login' })
        }
    }
      else next()
    })
    

var app=new Vue({
    el:"#app",
    router:router,
    store:store,
    template:`
    <div>
        <Navbar></Navbar>
        <router-view></router-view>
    </div>
    `,
    components:{
        Navbar
    },
    mounted:function(){
        store.dispatch('getSongs');
        store.dispatch("getAlbums");
        store.dispatch("getUsers")
    }
})
