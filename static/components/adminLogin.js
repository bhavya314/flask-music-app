const AdminLogin=Vue.component('AdminLogin',{
    template:`
    <div class='d-flex justify-content-center' style="margin-top: 25vh">
        <div class="mb-3 p-5 bg-light">
            <div class='text-danger' v-if="error">*{{error}}</div>
            <label for="user-email" class="form-label">Email address</label>
            <input type="email" class="form-control" id="user-email" placeholder="name@example.com" v-model="credentials.email">
            <label for="user-password" class="form-label">Password</label>
            <input type="password" class="form-control" id="user-password" v-model="credentials.password">
            <button class="btn btn-primary mt-2" @click='login' > Login </button>
        </div> 
    </div>
    `,
    data(){
        return {
            credentials:{
                email:null,
                password:null,
            },
            error:null,
        }
    },
    methods:{
        async login(){
            const res=await fetch('http://127.0.0.1:5000/admin-login',{
                method:'POST',
                headers:{
                    'Content-Type':'application/json'
                },
                body:JSON.stringify(this.credentials)
            })
            const data=await res.json()
            if(res.ok){
                this.$store.commit("setAuthToken",data.auth_token);
                this.$store.commit('setRole',data.role);
                this.$store.commit('setUser',data.user);
                this.$router.push("/");
            }else{
                this.error=data.message;
            }
        }
    }
})
export default AdminLogin