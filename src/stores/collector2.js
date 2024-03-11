import { defineStore, acceptHMRUpdate } from 'pinia'
// import { useStorage } from "vue3-storage";
import axios from 'axios';
import { sessionStore } from './session'
// const ls = useStorage();

export const collector_Store = defineStore('collector2', {
    state: () => ({
        daywise:[],
        carddaywise:[],
        updatecreation:[],
        reg:[],
        regcount:0,
        regsearch:[],
        wrongstatus: [],
        updatelist:[],
        cancelledcount:0,
        cardmap :[],
        settlement :[],
        settlementid:Number(),
        settlementlist:[],
        settlementcount:0,
        paysum: [],
        approve:[],
        cancel_invoice:[],
        error :"",
        rejectupdate:[]
    }),


    actions: {
        async removeError(){
            this.error = ""
        },

        async getbranchid(){
            const user = sessionStore();
            this.branch = user.user.branch_id
            return this.branch         
        },
       

        async getDaywisePayment(limit,offset,search) {
            const user = sessionStore();
            const token = user.token;
            if (token) {
                    const headers = {
                        'Authorization': ` ${token}`
                    }
                    const response = await axios.get(`https://gotest.qspiders.com/api/fc/daywise-payment-cash?limit=${limit}&offset=${offset}&search=${search}`,{
                        headers: headers
                    });
                    this.daywise = response.data
                    // this.daywisecount = response.data.total            
            } 
        },

        async getCardDaywisePayment(limit,offset,search) {
            const user = sessionStore();
            const token = user.token;
            if (token) {
                    const headers = {
                        'Authorization': ` ${token}`
                    }
                    const response = await axios.get(`https://gotest.qspiders.com/api/fc/daywise-payment-card?limit=${limit}&offset=${offset}&search=${search}`,{
                        headers: headers
                    });  
                    this.carddaywise = response.data
                    // this.carddaywisecount = response.data.total                 
            } 
        },
        
        async addUpdate(data){
            const user = sessionStore();                                                 
            const token = user.token
                if (token) {
                    const headers = {
                        'Authorization': ` ${token}`
                    }
                    try {  
                        const response = await axios.post('https://gotest.qspiders.com/api/fc/wrong-update',data,{
                            headers: headers
                        });
                        this.updatecreation = response.data
                    }
                    catch (err) {
                      this.error = err.response.data.error
                      return this.error
                  } 
                }
        },

        async getRegCode(page=0,search) {
          const user = sessionStore();
          const token = user.token;                                             
          if (token) {
                  const headers = {
                      'Authorization': `${token}`
                  }
                const response = await axios.get(`https://gotest.qspiders.com/api/fc/reg-code-list?page=${page}&search=${search}`,{
                    headers: headers
                });             
                this.reg = response.data.items
                this.regcount = response.data.total   
          } 
        },

        async get_RegCodes(filters) {
            const user = sessionStore();
            const token = user.token;                                             
            if (token) {
                    const headers = {
                        'Authorization': `${token}`
                    }
                //   const response = await axios.get(`https://gotest.qspiders.com/api/fc/reg-code-list?filters=${filters}`,{
                  const response = await axios.get(`https://gotest.qspiders.com/api/fc/reg-code-list?size=600`,{
                      headers: headers
                  });    
                  return this.regsearch = response.data.items
              
            } 
          },


        // async getRegSearch() {
        //   const user = sessionStore();
        //   const token = user.user.token;    
        //   if (token) {
        //     const headers = {
        //     'Authorization': `Token ${token}`
        //     }
        //     const response = await axios.get(`https://collector.qspiders.com/collector/course-trainer-list/?branch=${this.branch}`,{
        //         headers: headers
        //     });     
        //     this.regsearch = response.data
        //     return this.regsearch
        //   } 
        // },


        async getWrongStatus(data) {
          const user = sessionStore();
          const token = user.token;
          if (token) {
                  const headers = {
                      'Authorization': `${token}`
                  }
                const response = await axios.get('https://gotest.qspiders.com/api/users/get-wrong-statuses',{
                    headers: headers
                });             
                this.wrongstatus = response.data.items
                return this.wrongstatus
          } 
      },


      async getUpdateList(page=0,search) {
        const user = sessionStore();
        const token = user.token;
        if (token) {
                const headers = {
                    'Authorization': ` ${token}`
                }
                const response = await axios.get(`https://gotest.qspiders.com/api/fc/wrong-updates-list?page=${page}&search=${search}`,{
                    headers: headers
                });
                this.updatelist = response.data.items
                this.cancelledcount = response.data.total
                return this.updatelist
        } 
    },

    async getYetToSettle(data) {
      const user = sessionStore();
      const token = user.token;
      if (token) {
              const headers = {
                  'Authorization': ` ${token}`
              }
            const response = await axios.get(`https://gotest.qspiders.com/api/fc/yet-to-settle`,{
              headers: headers
            });
            return this.cardmap = response.data
      } 
  },


  async addSettlement(data){
    const user = sessionStore();                                                 
    const token = user.token                                              
        if (token) {
            const headers = {
                'Authorization': `${token}`,
            }
            try {  
                const response = await axios.post('https://gotest.qspiders.com/api/fc/add-settlement',data,{
                    headers: headers
                });
                    
            this.settlement = response.data
            this.settlementid = response.data.id 
            return this.settlementid    
            }
            catch (err) {
                this.error = err.response.data.message
                return this.error
            } 
        }
},

  async getSettlementlist(page=0,search) {
    const user = sessionStore();
    const token = user.token
        if (token) {
            const headers = {
                'Authorization': `${token}`
            }
            const response = await axios.get(`https://gotest.qspiders.com/api/fc/get-settlement?page=${page}&search=${search}`,{
                headers: headers
            });
            this.settlementlist = response.data  
            this.settlementcount = response.data.total                          
        }
    },

    async getSummary(date) {
      const user = sessionStore();
      const token = user.token
        if (token) {
            const headers = {
                'Authorization': `${token}`
            }
            const response = await axios.get(`https://gotest.qspiders.com/api/fc/payment-summary?date=${date}`,{ 
                headers: headers
            });
            this.paysum = response.data                        
        }
    },

    async add_approve(data){
        const user = sessionStore();                                                 
        const token = user.token
            if (token) {
                const headers = {
                    'Authorization': `${token}`
                }
                try {  
                    const response = await axios.post('https://gotest.qspiders.com/api/fc/approve-wrong-update',data,{
                        headers: headers
                    });
                    this.approve = response.data
                }
                catch (err) {
                  this.error = err.response.data.message
                  return this.error
              } 
            }
    },

    async cancelinvoice(data){
        const user = sessionStore();                                                 
        const token = user.token
            if (token) {
                const headers = {
                    'Authorization': `${token}`
                }
                try {  
                    const response = await axios.post('https://gotest.qspiders.com/api/fc/cancel-invoice',data,{
                        headers: headers
                    });
                    this.cancel_invoice = response.data
                }
                catch (err) {
                  this.error = err.response.data.error
                  return this.error
              } 
            }
    },

    async add_rejectupdate(data){
        const user = sessionStore();                                                 
        const token = user.token
            if (token) {
                const headers = {
                    'Authorization': `${token}`
                }
                try {  
                    const response = await axios.post('https://gotest.qspiders.com/api/fc/reject-request',data,{
                        headers: headers
                    });
                    this.rejectupdate = response.data
                    return this.rejectupdate
                }
                catch (err) {
                  this.error = err.response.data.error
                  return this.error
              } 
            }
    },


            
    }

})

if (import.meta.hot) {
    import.meta.hot.accept(acceptHMRUpdate(collector_Store, import.meta.hot))
}

