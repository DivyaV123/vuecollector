
import { defineStore, acceptHMRUpdate } from 'pinia'
import { themeStore } from "../stores/theme"
import Cookies from 'js-cookie'
import jwt_decode from "jwt-decode";
import axios from 'axios';
export const sessionStore = defineStore('user', {
    state: () => ({
        user: null,
        token:null,
        loggedIn: false,
        collectorRole: false,
        loginError: '',
        author: null,
        send_mail:[],
        verify_otp:[],
        new_pass:[]
    }),
    actions: {
        async login(data) {
            const theme = themeStore();
            try {
                const response = await axios.post('https://gotest.qspiders.com/api/user/login', data,{
                    headers:{
                        "Content-Type":"application/json"
                    }
                });                
                if (response.status === 200) {
                    if(response.data.token){   
                        var decoded = jwt_decode(response.data.token);
                        const roles = decoded.roles
                        let collector = false
                        const result = roles.some(element => {
                            if (element.name === "feecollector") {
                                Cookies.set('user', response.data.token,{expires:365} ,{ domain: '.qspiders.com' })
                                this.collectorRole = true
                                this.$patch({
                                    user: decoded,
                                    author: { id:decoded.uid, name:decoded.username, roles:decoded.roles, branches:decoded.branches },
                                    token: response.data.token,
                                    loggedIn: true,
                                })
                                collector = true    
                                theme.pushMessage("Login Successful")
                            }                            
                            }); 
                            if(collector === false){
                                theme.pushMessage("Login failed, you are unauthorized for this website")
                            }
                        }
                        else {
                            theme.pushMessage(response.data.error)
                          }   
                      }
                      else {
                        theme.pushMessage("Login failed, please check your username and password")
                      }
                
                    } catch (err) {
                        theme.pushMessage(err.response.data.error)
                    }
                },

       
        async logout() {
            try {
                Cookies.remove('user')
                this.$patch({
                    user: null,
                    author: null,
                    token:null,
                    loggedIn: false,
                })
  
                return true
            }
            catch (err) {
                return false
            }
    },
        async checkUser() {
            if (this.user === null) {
              if (Cookies.get('user')) {
                  const token = Cookies.get('user')
                  const decoded = jwt_decode(token);
                  if (decoded) {
                      const roles = decoded.roles
                      const result = roles.some(element => {
                        if (element.name === "feecollector") {
                            this.collectorRole = true
                            this.$patch({
                                user: decoded,
                                author: { id:decoded.uid, name:decoded.username, roles:decoded.roles, branches:decoded.branches },
                                token: token,
                                loggedIn: true,
                            })
                        }
                    });
                  }
                  else {
                      theme.pushMessage("You do not have permission to enter this role/domain.")
                  }
        
              }
          }
          },
          async forgotsendemail(data) {
            try{
                const response = await axios.post(` https://gotest.qspiders.com/api/batch/sendmail`,data);
                this.send_mail = response.data
                return this.send_mail
            }
            catch(error){
                this.error_send_mail =  error.response.data
            }
    
    },
    async verifyotp(data) {
              try{
                  const response = await axios.post(`https://gotest.qspiders.com/api/user/checkotp`,data);
                  this.verify_otp = response.data
                  return this.verify_otp
              }
              catch(error){
                  this.error =  error.response.data
              }
      
      },
    
    
      async changenew_password(data) {
                try{
                    const response = await axios.post(`https://gotest.qspiders.com/api/user/changepasswordafterotp`,data);
                    this.new_pass = response.data
                     return this.new_pass
                }
                catch(error){
                    this.error =  error.response.data
                }
        
        },
    }
})

if (import.meta.hot) {
    import.meta.hot.accept(acceptHMRUpdate(sessionStore, import.meta.hot))
}
