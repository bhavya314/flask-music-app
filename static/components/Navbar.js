export default {
  template: `
  <div>
    <nav class="navbar navbar-expand-lg bg-body-tertiary">
      <div class="container-fluid">
          <a v-if='role===null'><router-link class="nav-link active" aria-current="page" to="/">Home</router-link></a>
          <a v-if="role"><router-link class="nav-link active" aria-current="page" to="/">{{ user.username }}</router-link></a>
          <a v-if='role!==null&&role!=="admin"'><router-link class="nav-link active" aria-current="page" to="/profile">Profile</router-link></a>
          <a v-if='role==="user"||role==="creator"'><router-link class="nav-link active" aria-current="page" to="/create-playlist">Create Playlist</router-link></a>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>
        <form class="d-flex ms-auto" @submit.prevent="search">
          <input class="form-control me-2" type="search" v-model="query" placeholder="Search" aria-label="Search">
          <button class="btn btn-outline-light" type="submit">Search</button>
        </form>
        <div class="collapse navbar-collapse justify-content-end" id="navbarNav">
          <ul class="navbar-nav">
            <li class="nav-item" v-if="role===null">
              <router-link class="nav-link" aria-current="page" to="/admin-login">Admin Login</router-link>
            </li>
            <li class="nav-item" v-if="role===null">
              <router-link class="nav-link" aria-current="page" to="/user-login"> User Login</router-link>
            </li>
            <li class="nav-item" v-if="role===null">
              <router-link class="nav-link" aria-current="page" to="/user-register">Register As User</router-link>
            </li>
            <li class="nav-item" v-if="role==='admin'">
              <router-link class="nav-link" to="/users">Users</router-link>
            </li>
            <li class="nav-item" v-if="role==='admin'">
              <router-link class="nav-link" to="/allalbums">Albums</router-link>
            </li>
            <li class="nav-item" v-if="role==='admin'">
              <router-link class="nav-link" to="/allsongs">Songs</router-link>
            </li>
            <li class="nav-item" v-if="role==='creator'">
              <router-link class="nav-link" to="/create-song">Add Song</router-link>
            </li>
            <li class="nav-item" v-if="role==='user'">
              <a class="nav-link" @click='user_register_as_creator()'>Register as Creator</a>
            </li>
            <li class="nav-item" v-if="role==='creator'">
              <router-link class="nav-link" to="/create-album">Add Album</router-link>
            </li>
            <li class="nav-item" v-if="is_login">
              <button class="nav-link" @click='logout'>logout</button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  </div>
  `,
  data(){
    return{
      query: ''
    }
  },
  computed:{
    is_login:function(){
      return this.$store.getters.getAuthToken;
    },
    role: function() {
      return this.$store.getters.getRole;
    },
    user:function(){
      return this.$store.getters.getCurrentUser;
    }
  },
  
  methods:{
    async user_register_as_creator(){
      const res=await fetch('/user-register-as-creator',{
        method:'POST',
        headers:{
            'Content-Type':'application/json',
            'Authentication-Token':this.is_login
        },
        body:JSON.stringify({'id':this.$store.getters.getCurrentUser.id})
      });
      const data=await res.json()
      if(res.ok){
        // console.log(data)
        alert(data.message);
        this.$store.commit("setRole",data.role);
        this.$store.commit('setAuthToken',data.auth_token);
        this.$store.commit('setUser',data.user)
        this.$router.push('/');
      }
      else{
        alert(data.message);
      }
    },
    async logout() {
      const res=await fetch('/user-logout',{
      'Authentication-Token':this.is_login,
      'Content-Type':'application/json'
      });
      const data=await res.json()
      if (res.ok){
        this.$store.commit('logout');
        alert(data.message)
        this.$router.push('/')
      }
      else{
        alert("Error")
      }
    },
    async search(){
      const res=await fetch('http://127.0.0.1:5000/search',{
        method:'POST',
        headers:{
          'Content-Type':'application/json',
          'Authentication-Token':this.$store.getters.getAuthToken
        },
        body:JSON.stringify({'query':this.query})
      });
      const data=await res.json();
      if(res.ok){
        // console.log(data)
        this.$store.commit('setSearch',data.search);
        // console.log(this.$store.getters.getSearch);
        this.query='';
        this.$router.push('/search-results');
      }
      else{
        console.log(data.message)
      }
    }
  }
}