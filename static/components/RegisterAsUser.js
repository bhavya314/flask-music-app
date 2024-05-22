const RegisterAsUser=Vue.component('RegisterAsUser',{
    template:`
    <div class="container">
        <div class='d-flex justify-content-center' style="margin-top: 25vh">
            <div class="mb-3 p-5 bg-light">
                <div class='text-danger'>{{error}}</div>
                <label for="user-email" class="form-label">Email address</label>
                <input type="email" class="form-control" id="user-email" placeholder="name@example.com" v-model="credentials.email">
                <label for="user-username" class="form-label">Username</label>
                <input type="email" class="form-control" id="user-username" placeholder="name_user" v-model="credentials.username">
                <label for="user-password" class="form-label">Password</label>
                <input type="password" class="form-control" id="user-password" v-model="credentials.password">
                <label for="confirm-password" class="form-label">Confirm Password</label>
                <input type="password" class="form-control" id="confirm-password" v-model="credentials.confirmPassword">
                <button class="btn btn-primary mt-2" @click='register' > Register </button>
            </div> 
        </div>
    </div>
    `,
    data(){
        return {
            credentials:{
                email:null,
                username:null,
                password:null,
                confirmPassword:null
            },
            error:null,
        }
    },
    methods:{
        async register(){
            if (this.credentials.confirmPassword!==this.credentials.password){
                this.error = "Passwords do not match.";
            }else{
                const res=await fetch('/user-register',{
                    method:'POST',
                    headers:{
                        'Content-Type':'application/json'
                    },
                    body:JSON.stringify(this.credentials)
                });
                const data=await res.json();
                if(res.ok){
                    this.$store.commit("setAuthToken",data.auth_token);
                    this.$store.commit('setRole',data.role);
                    this.$store.commit('setUser',data.user);
                    alert(data.message);
                    this.$router.push("/");
                }else{
                    this.error=data.message;
                }
            }
        }
    }
})
export default RegisterAsUser