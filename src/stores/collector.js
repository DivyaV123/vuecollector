import { defineStore, acceptHMRUpdate } from 'pinia'
// import { useStorage } from "vue3-storage";
import axios from 'axios';
import { sessionStore } from './session'
import { collector_Store } from './collector2'

// const ls = useStorage();

export const collectorStore = defineStore('collector', {
    state: () => ({
        branch:String(),
        courses: [],
        courselen:0,
        coursedetails:[],
        profile:[],
        address:0,
        paytype:[],
        coursecount :0,
        coursesuid: [],
        stdreceipt:[],
        changepwd:[],
        pay:[],
        bank:[],
        yet_to_deposit:[],
        deposit:[], 
        depositchallan:[],  
        depositid:Number(),
        bdepositlist:[],
        depositcount:0,
        mergemap:[],
        mapstudents:[],
        mapstudent:[],
        mapids:[],
        mapcount:0,
        error : "",
        receipt : Number(),
        cardstudents:[],
        verify_students:[],
        unsettlestudents:[],
        st_regcode:"",
        update_course:[],
        country:[],
        state:[],
        statess:[],
        sity:[],
        locations:[],
        reg_value:'',
        check_number:null,
        error_checknumber:"",
        invoicenumbers:[],
        pincodes:[],
        branches:[],
        paymentdetails:[],
        assigned_branches:[],
        // logouterror:[],
        transaction_type:[],
        con_reason:[],
        conc_list:[],
        con:[],
        error_con:"",
        batch_list:[],
        error_data:""
        // update:[]
    }),
    actions: {
        async removeError(){
            this.error = ""
        },

        async changepassword(data){
            const user = sessionStore();                                                 
            const token = user.token                                           
                if (token) {
                    const headers = {
                        'Authorization': `${token}`
                    }
                    try {  
                        const response = await axios.post('https://gotest.qspiders.com/api/fc/change-password',data,{
                            headers: headers
                        });                          
                    this.changepwd = response.data
                    }
                    catch (err) {
                        this.error = err.response.data.error
                        return this.error    
                    }
                }
        },
        
        async getbranchid(){
            const user = sessionStore();
            this.branch = user.user.branch_id
            return this.branch         
        },
        
        
        async getCourses(data) {
            const user = sessionStore();
            const token = user.token; 
            if (token) {
                    const headers = {
                        'Authorization': `${token}`,
                        "Content-Type": "application/json"
                    }
                if (data.email || data.contact){
                  try {
                  const response = await axios.get(`https://gotest.qspiders.com/api/fc/get-student-by-em?email=${data.email}&contact=${data.contact}`,{
                    headers: headers
                  });
                this.courses = response.data.student
                this.courselen = response.data.student.student_course.length
                this.coursedetails = response.data.student.student_course
                this.paymentdetails = response.data.student.student_payments
              }
              catch (err) {
            }
        }
        else{
            try {
                const response = await axios.get(`https://gotest.qspiders.com/api/fc/get-student-by-id?id=${data.id}`,{
                  headers: headers
                });
                this.courses = response.data.result
                this.courselen = response.data.result.student_course.length
                this.coursedetails = response.data.result.student_course
                this.paymentdetails = response.data.result.student_payments
            }
            catch (err) {
          }
        }
            } 
        },

        async getReceipt(id) {
            const user = sessionStore();
            const token = user.token;  
            if (token) {
                    const headers = {
                        'Authorization': `${token}`
                    }
                    const response = await axios.get(`https://gotest.qspiders.com/api/fc/get-invoice-fc?id=${id}`,{
                        headers: headers
                    });
                    this.stdreceipt = response.data
                    return this.stdreceipt
            } 
        },

        async getPaymentType() {
            const user = sessionStore();
            const token = user.token;  
            if (token) {
                    const headers = {
                        'Authorization': `${token}`
                    }
                    const response = await axios.get(`https://gotest.qspiders.com/api/users/get-payment-types`,{
                        headers: headers
                    });
                    this.paytype = response.data.items
                    return this.paytype
            } 
        },

       
        async getPay(data){
            const user = sessionStore();                                                 
            const token = user.token                                           
                if (token) {
                    const headers = {
                        'Authorization': `${token}`
                    }
                    try {  
                        const response = await axios.post('https://gotest.qspiders.com/api/fc/add-payment',data,{
                            headers: headers
                        });                          
                    this.pay = response.data
                    }
                    catch (err) {
                        this.error = err.response.data.error
                        return this.error    
                    }
                }
        },

        async getBank(page=0) {
            // this.getbranchid()
            const user = sessionStore();
            const token = user.token;  
            if (token) {
                    const headers = {
                        'Authorization': `${token}`
                    }
                    const response = await axios.get(`https://gotest.qspiders.com/api/users/get-banks?page=${page}`,{
                        headers: headers
                    });
                    this.bank = response.data.items
                    return this.bank
            } 
        },
        async getyettodeposit() {
            // this.getbranchid()
            const user = sessionStore();
            const token = user.token;  
            if (token) {
                    const headers = {
                        'Authorization': `${token}`
                    }
                    const response = await axios.get(`https://gotest.qspiders.com/api/fc/yet-to-deposit`,{
                        headers: headers
                    });
                    this.yet_to_deposit = response.data
                    return this.yet_to_deposit
            } 
        },


        async addBankdeposit(data){
            // this.getbranchid()
            const user = sessionStore();                                                 
            const token = user.token                                              
                if (token) {
                    const headers = {
                        'Authorization': `${token}`,
                    }
                    try {  
                        const response = await axios.post('https://gotest.qspiders.com/api/fc/add-deposit',data,{
                            headers: headers
                        });
                            
                    this.deposit = response.data
                    this.depositid = response.data.id
                    return this.depositid                
                    }
                    catch (err) {
                        this.error = err.response.data.message
                        return this.error
                    } 
                }
        },

        
        async getBdepositlist(page=0,search) {
            const user = sessionStore();
            const token = user.token
            if (token) {
                const headers = {
                    'Authorization': ` ${token}`
                }
                const response = await axios.get(`https://gotest.qspiders.com/api/fc/get-deposit?page=${page}&search=${search}`,{
                    headers: headers
                });
                this.bdepositlist = response.data
                this.depositcount =response.data.total                                                
            }
        },


        async add_bdmerge(data){
            const user = sessionStore();                                                 
            const token = user.token
                if (token) {
                    const headers = {
                        'Authorization': `${token}`,
                    }
                    try {  
                        const response = await axios.post('https://gotest.qspiders.com/api/fc/merge-deposit',data,{
                            headers: headers
                        });
                    this.mergemap = response.data               
                    }
                    catch (err) {
                        this.error = err.response.data.message
                        return this.error
                    } 
                }
        },

        async getMapStudents(data) {
            // this.getbranchid()

            const user = sessionStore();
            const token = user.token                                             
            if (token) {
                const headers = {
                    'Authorization': `${token}`
                }
                const result = await axios.get(`https://gotest.qspiders.com/api/fc/unmapped-student-cash?branch=${data}`,{
                    headers: headers
                });  //page=1,data    https://collector.qspiders.com/collector/get-student-list/?page=${page}&branch=${this.branch}&type=1
                this.mapstudents = result.data
                // this.mapcount = result.data.total 
                // return this.mapstudents                          
            }
        },

        async mapStudents(data){
            const user = sessionStore();                                                 
            const token = user.token
            // data["deposit_id"] = this.depositid                                                
            
                if (token) {
                    const headers = {
                        'Authorization': `${token}`,
                    }
                    try {  
                        const response = await axios.post('https://gotest.qspiders.com/api/fc/map-cash-student',data,{
                            headers: headers
                        });
                    this.mapstudent = response.data
                    return this.mapstudent                    
                    }
                    catch (err) {
                        this.error = err.response.data.message
                        return this.error
                    } 
                }
        },

        async get_cardstudents(limit,offset,search) {
            const user = sessionStore();
            const token = user.token;  
            if (token) {
                    const headers = {
                        'Authorization': `${token}`
                    }
                    const response = await axios.get(`https://gotest.qspiders.com/api/fc/card-students?limit=${limit}&offset=${offset}&search=${search}`,{
                        headers: headers
                    });
                    this.cardstudents = response.data
                    return this.cardstudents
            } 
        },

        async verify_cardpayments(data){
            const user = sessionStore();                                                 
            const token = user.token                                            
                if (token) {
                    const headers = {
                        'Authorization': `${token}`,
                    }
                    try {  
                        const response = await axios.post('https://gotest.qspiders.com/api/fc/settle-students',data,{
                            headers: headers
                        });
                    this.verify_students = response.data
                    return this.verify_students                    
                    }
                    catch (err) {
                        this.error = err.response.data.message
                        return this.error
                    } 
                }
        },

        async get_unsettlestudents(limit,offset,search) {
            const user = sessionStore();
            const token = user.token;  
            if (token) {
                    const headers = {
                        'Authorization': `${token}`
                    }
                    const response = await axios.get(`https://gotest.qspiders.com/api/fc/unsettle-student-list?limit=${limit}&offset=${offset}&search=${search}`,{
                        headers: headers
                    });
                    this.unsettlestudents = response.data
                    return this.unsettlestudents
            } 
        },

        // async get_branches() {
        //     const user = sessionStore();
        //     const token = user.token;  
        //     if (token) {
        //             const headers = {
        //                 'Authorization': `${token}`
        //             }
        //             const response = await axios.get(`https://gotest.qspiders.com/api/fv/all-branches`,{
        //                 headers: headers
        //             });
        //             this.branches = response.data
        //             return this.branches
        //     } 
        // },

        // async add_regcode(data) {
        //     const user = sessionStore();
        //     const token = user.token
        //     try {
        //         if (token) {
        //             const response = await axios.post(`https://gotest.qspiders.com/api/fc/add-student-regcode`, data, {
        //                 headers: {
        //                     'Authorization': `${token}`,
        //                     "Content-Type": "application/json",
        //                 }
        //             });
        //             this.st_regcode = response.data
        //             return this.st_regcode
        //         }
        //     } catch (error) {
        //         this.error = error.response.data.error
        //         return this.error
        //     }
        // },

        async add_regcode(data) {
            const user = sessionStore();
            const token = user.token
            try {
                if (token) {
                    const response = await axios.post(`https://gotest.qspiders.com/api/fc/add-student-regcode`, data, {
                        headers: {
                            'Authorization': `${token}`,
                            "Content-Type": "application/json",
                        }
                    });
                    if(response.data.message){
                        this.st_regcode = response.data.message
                        return this.st_regcode
                    }
                    else{
                        this.st_regcode = response.data.error
                        return this.st_regcode
                    }                   
                }
            } catch (error) {
                this.error = error.response.data.error
                return this.error
            }
        },

        async updatecourse(data) {
            const user = sessionStore();
            const token = user.token
            try {
                if (token) {
                    const response = await axios.post(`https://gotest.qspiders.com/api/fc/add-student-regcode`, data, {
                        headers: {
                            'Authorization': `${token}`,
                            "Content-Type": "application/json",
                        }
                    });
                    this.update_course = response
                    return this.update_course
                }
            } catch (error) {

                this.update_course_error = error.response.data.error
            }
        },

        async getState(query) {
            const token = this.token
            if (token) {
                const headers = {
                    'Authorization': `${token}`
                }
                const response = await axios.get(`https://gotest.qspiders.com/api/student/selectstate?name=${query}`, {
                    headers: headers
                });
                this.state = response.data.items

                return this.state

            }
        },

        async getstudentcountry(query) {
            const token = this.token
                const headers = {
                    'Authorization': `${token}`
                }
                const response = await axios.get(`https://gotest.qspiders.com/api/student/get-countries`, {
                    headers: headers
                });
                this.country = response.data

                return this.country
            
        },

        async getstudentState(query) {
            const token = this.token
                const headers = {
                    'Authorization': `${token}`
                }
                const response = await axios.get(`https://gotest.qspiders.com/api/students/get-states?id=${query}`, {
                    headers: headers
                });
                this.statess = response.data

                return this.statess
        },

        // async getstudentcity(data) {
        //     const token = this.token
        //         const headers = {
        //             'Authorization': `${token}`
        //         }
        //         const response = await axios.get(`https://gotest.qspiders.com/api/student/get-cities?id=${data}`, {
        //             headers: headers
        //         });
        //         this.locations = response.data
        //         return this.locations  
        // },

        async getstudentcity(data) {
            const token = this.token
                const headers = {
                    'Authorization': `${token}`
                }
                const response = await axios.get(`https://gotest.qspiders.com/api/student/registration-districts?state=${data}`, {
                    headers: headers
                });
  
                this.locations = response.data.items
                return this.locations

            
        },
        async getstudentpincode(data) {
            const token = this.token
                const headers = {
                    'Authorization': `${token}`
                }
                const response = await axios.get(`https://gotest.qspiders.com/api/student/pincodes?district=${data}`, {
                    headers: headers
                });
                
                this.pincodes = response.data.items
                return this.pincodes

            
        },
        async registration(data){
            const user = sessionStore();                                                 
            const token = user.token                                              
                if (token) {
                    const headers = {
                        'Authorization': `${token}`,
                    }
                    try {  
                        const response = await axios.post('https://gotest.qspiders.com/api/fc/student-register',data,{
                            headers: headers
                        });     
                    this.reg_value = response.data.message
                    return this.reg_value                
                    }
                    catch (err) {
                        this.error = err.response.data.error
                        return this.error
                    } 
                }
        },

        async getstudentnumbercheck(data) {
            try{
                const response = await axios.get(`https://gotest.qspiders.com/api/student/check-number?number=${data}`);
                this.check_number = response.data.data
                return this.check_number
            }
            catch (error) {
                this.check_number = true
            }
        },

        async get_invoicenumbers(page=0,date) {
            const user = sessionStore();
            const token = user.token;  
            if (token) {
                    const headers = {
                        'Authorization': `${token}`
                    }
                    const response = await axios.get(`https://gotest.qspiders.com/api/fc/invoice-list?page=${page}&date=${date}`,{
                        headers: headers
                    });
                    this.invoicenumbers = response.data
                    return this.invoicenumbers
            } 
        },

        async get_assigned_branches() {
            const user = sessionStore();
            const token = user.token;  
            if (token) {
                    const headers = {
                        'Authorization': `${token}`
                    }
                    const response = await axios.get(`https://gotest.qspiders.com/api/users/get-assigned-branch`,{
                        headers: headers
                    });
                    this.assigned_branches = response.data.result
                    return this.assigned_branches
            } 
        },

        async getTransactionType() {
            const user = sessionStore();
            if (user.token) {
                const headers = {
                    'Authorization': user.token,
                    "Content-Type": "application/json",
                }
                try {
                    const trans = await axios.get(`https://gotest.qspiders.com/api/admin/get-transaction-type?size=500`, {
                        headers: headers
                    });
                    this.transaction_type = trans.data
                }
                catch (err) {
                    console.log("errors", err)
                }
            }
        },

        async getconcessionreason(id,branch) {
            const user = sessionStore();
            const token = user.token;
           
            if (token) {
                    const headers = {
                        'Authorization': ` ${token}`
                    }
                  try {
                  const concession= await
                  axios.get(` https://gotest.qspiders.com/api/admin/get-concession-reasons`,{
                    headers: headers
                  });
                this.con_reason = concession.data
                // this.users_total = response1.data.total
              }
              catch (err) {
                console.log("err", err.response1)    
              }
            } 
          },

          async postconcession(form) {
            const user = sessionStore();
            const token = user.token
            try {
                if (token) {
                    const response = await axios.post(`https://gotest.qspiders.com/api/fc/tracker-concession`, form, {
                        headers: {
                            'Authorization': `${token}`,
                        }
                    });
                    this.con = response.data.message
                    return this.con
                }
            } catch (error) {
                this.error_con=error.response.data.error
                return this.error_con
            }
        },
          async getconcessionlist(page=0,search="") {
            const user = sessionStore();
            const token = user.token;
           
            if (token) {
                    const headers = {
                        'Authorization': ` ${token}`
                    }
                  try {
                  const response1 = await
                  axios.get(` https://gotest.qspiders.com/api/fc/concession-list?page=${page}&${search}`,{
                    headers: headers
                  });
                this.conc_list = response1.data
              }
              catch (err) {
                console.log("err", err.response1)    
              }
            }
          
          },

          async getbatchlist(data) {
            const user = sessionStore();
            const token = user.token;
            if (token) {
                    const headers = {
                        'Authorization': ` ${token}`
                    }
                    if (data&&(data.email || data.number)){
                      try {
                      const response = await axios.get(` https://gotest.qspiders.com/api/fc/student-details?email=${data.email}&number=${data.number}`,{
                        headers: headers
                      });
                    this.batch_list = response.data
                 
              }
              catch( error) {
                if (error.response) {
                  if(error.response.status === 400){
                    this.batch_list=[]
                    this.error_data=error.response.data.error
                  }
                } 
              };
            }
            }
          },
  
    }
})

if (import.meta.hot) {
    import.meta.hot.accept(acceptHMRUpdate(collectorStore, import.meta.hot))
}

