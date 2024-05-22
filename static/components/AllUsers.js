const Users=Vue.component('Users',{
    template:`
    <div>
        <table class="table table-hover" v-if='users.length!==0'>
            <thead>
                <tr>
                    <th scope="col">Username</th>
                    <th scope="col">Email</th>
                    <th scope="col">Role</th>
                    <th scope="col"></th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="user in users" :key='user.id'>
                    <td>{{ user.username }}</td>
                    <td>{{ user.email }}</td>
                    <td v-if="user.roles[0].name==='user'">User</td>
                    <td v-else-if="user.roles[0].name==='creator'">Creator</td>
                    <td>
                        <button type="button" class="btn btn-danger" v-if="user.roles[0].name==='creator' && user.blacklisted===false" @click="blacklist(user.id)">Blackelist User</button>
                        <button type="button" class="btn btn-success" v-else-if="user.roles[0].name==='creator' && user.blacklisted===true" @click="whitelist(user.id)">Remove from Blacklist</button>
                    </td>
                </tr>
            </tbody> 
        </table>
    </div>
    `,
    computed:{
        users: function(){ 
            let users= this.$store.getters.getAllUsers
            return users.filter((item)=>item.roles[0].name!=='admin')
        }
    },
    methods:{
        async blacklist(id){
            try{
                const res=await fetch(`http://127.0.0.1:5000/blacklist_user/${id}`, {method:'GET',headers:{
                    'Authentication-Token':this.$store.getters.getAuthToken
                }}
                )
                const data= await res.json();
                if(res.status===200){
                    alert(data.message)
                    this.$store.commit("updateUser",data.user);
                    this.$router.push('/users')
                }else{
                    alert(data.message)
                }
            }catch(error){
                console.log(error)
            }
        },
        async whitelist(id){
            try{
                const res=await fetch(`http://127.0.0.1:5000/whitelist_user/${id}`, {method:'GET',headers:{
                    'Authentication-Token':this.$store.getters.getAuthToken
                }}
                )
                const data= await res.json();
                if(res.status===200){
                    alert(data.message)
                    this.$store.commit("updateUser",data.user);
                    this.$router.push('/users')
                }else{
                    alert(data.message)
                }
            }catch(error){
                console.log(error)
            }
        }
    }
})
export default Users;