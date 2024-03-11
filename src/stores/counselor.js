import { defineStore, acceptHMRUpdate } from 'pinia'
import axios from 'axios';
import { sessionStore } from './session'
import { themeStore } from "../stores/theme"

export const counselorStore = defineStore('counselor', {

    state: () => ({
        mode: [],           
        classtiming: [], 
        timeslot: [],   
        highestdegree: [], 
        courses: [],  
        modeclass: [], 
        branches: [], 
        degree: [],  
        streams: [],   
        colleges: [],    
        singleRecord: [], 
        courseBranches: [],
        special_course: [],
    }),
    actions: {
        async getClassTiming() {
            const user = sessionStore();
            if (user.token) {
                const headers = {
                    'Authorization': user.token,
                    "Content-Type": "application/json",
                }
                try {
                    const classtiming = await axios.get(`https://gotest.qspiders.com/api/batch/classtiming?size=500`, {
                        headers: headers
                    });
                    this.classtiming = classtiming.data
                }
                catch (err) {
                    console.log("errors:", err.response.data)
                }
            }
        },
        async getTimeSlots() {
            const user = sessionStore();
            if (user.token) {
                const headers = {
                    'Authorization': user.token,
                    "Content-Type": "application/json",
                }
                try {
                    const timeslot = await axios.get(`https://gotest.qspiders.com/api/batch/timeslots?size=500`, {
                        headers: headers
                    });
                    this.timeslot = timeslot.data.items.reverse()
                }
                catch (err) {
                    console.log("errors:", err.response.data)
                }
            }
        },
        async getCourses() {
            const user = sessionStore();
            if (user.token) {
                const headers = {
                    'Authorization': user.token,
                    "Content-Type": "application/json",
                }
                try {
                    const courses = await axios.get(`https://gotest.qspiders.com/api/counselor/get-counselor-courses?size=500`, {
                        headers: headers
                    });
                    this.courses = courses.data
                }
                catch (err) {
                    console.log("errors:", err.response.data)
                }
            }
        },
        async getModeClass() {
            const user = sessionStore();
            if (user.token) {
                const headers = {
                    'Authorization': user.token,
                    "Content-Type": "application/json",
                }
                try {
                    const modeclass = await axios.get(`https://gotest.qspiders.com/api/batch/modeofclasses?size=500`, {
                        headers: headers
                    });
                    this.modeclass = modeclass.data
                }
                catch (err) {
                    console.log("errors:", err.response.data)
                }
            }
        },
        async getModeEnquiry() {
            const user = sessionStore();
            if (user.token) {
                const headers = {
                    'Authorization': user.token,
                    "Content-Type": "application/json",
                }
                try {
                    const mode = await axios.get(`https://gotest.qspiders.com/api/counselor/get-modeofenq`, {
                        headers: headers
                    });
                    this.mode = mode.data
                }
                catch (err) {
                    console.log("errors:", err.response.data)
                }
            }
        },
        async getHighestDegree() {
            const user = sessionStore();
            if (user.token) {
                const headers = {
                    'Authorization': user.token,
                    "Content-Type": "application/json",
                }
                try {
                    const highestdegree = await axios.get(`https://gotest.qspiders.com/api/users/qualifications?size=500`, {
                        headers: headers
                    });
                    this.highestdegree = highestdegree.data
                }
                catch (err) {
                    console.log("errors:", err.response.data)
                }
            }
        },
        async getBranches() {
            const user = sessionStore();
            if (user.token) {
                const headers = {
                    'Authorization': user.token,
                    "Content-Type": "application/json",
                }
                try {
                    const branches = await axios.get(`https://gotest.qspiders.com/api/branch/branches?size=500`, {
                        headers: headers
                    });
                    this.branches = branches.data
                }
                catch (err) {
                    console.log("errors:", err.response.data)
                }
            }
        },

        async getCourseBranches(query) {
            const user = sessionStore();
            if (user.token) {
                const headers = {
                    'Authorization': user.token,
                    "Content-Type": "application/json",
                }
                try {
                    const courseBranches = await axios.get(`https://gotest.qspiders.com/api/counselor/get-course-branches?name=${query}`, {
                        headers: headers
                    });
                    this.courseBranches = courseBranches.data
                    // return courseBranches.data
                }
                catch (err) {
                    console.log("errors:", err.response.data)
                }
            }
        },
        async getDegree() {
            const user = sessionStore();
            if (user.token) {
                const headers = {
                    'Authorization': user.token,
                    "Content-Type": "application/json",
                }
                try {
                    const degree = await axios.get(`https://gotest.qspiders.com/api/users/degrees?size=500`, {
                        headers: headers
                    });
                    this.degree = degree.data
                }
                catch (err) {
                    console.log("errors:", err.response.data)
                }
            }
        },
        async getRecord(rid) {
            const user = sessionStore();
            if (user.token) {
                const headers = {
                    'Authorization': user.token,
                    "Content-Type": "application/json",
                }
                try {
                    const record = await axios.get(`https://gotest.qspiders.com/api/counselor/get-record?rid=${rid}`, {
                        headers: headers
                    });
                    this.singleRecord = record.data
                }
                catch (err) {
                    console.log("errors", err)
                }
            }
        },
        async getStreams(query) {
            const user = sessionStore();
            if (user.token) {
                const headers = {
                    'Authorization': user.token,
                    "Content-Type": "application/json",
                }
                try {
                    const streams = await axios.get(`https://gotest.qspiders.com/api/users/streams?${query}`, {
                        headers: headers
                    });
                    this.streams = streams.data
                    return streams.data
                }
                catch (err) {
                    console.log("errors:", err.response.data)
                }
            }
        },
        async getColleges(query) {
            const user = sessionStore();
            if (user.token) {
                const headers = {
                    'Authorization': user.token,
                    "Content-Type": "application/json",
                }
                try {
                    const colleges = await axios.get(`https://gotest.qspiders.com/api/users/colleges?size=10&${query}`, {
                        headers: headers
                    });
                    // this.colleges = colleges.data
                    return colleges.data
                }
                catch (err) {
                    console.log("errors:", err.response.data)
                }
            }
        },
        async submitEnquiry(form) {
            const user = sessionStore();
            const theme = themeStore();
            if (user.token) {
                const headers = {
                    'Authorization': user.token,
                    "Content-Type": "application/json",
                }
                try {
                    const response = await axios.post(`https://gotest.qspiders.com/api/counselor/add-enquiry`, form, { headers }).then(
                        function (response) {
                            theme.pushMessage(response.data.message)
                        }
                    ).catch(function (error) {
                        if (error.response) {
                            if (error.response.status === 400) {
                                theme.pushMessage(error.response.data.error)
                            }
                        }
                        else if (error.request) { }
                        else { }
                    });
                }
                catch (err) {
                    return { message: 'Error has occured', error: err };
                }
            }
        },

        async getSpecialCourse() {
            const user = sessionStore();
            if (user.token) {
                const headers = {
                    'Authorization': user.token,
                    "Content-Type": "application/json",
                }
                try {
                    const classtiming = await axios.get(`https://gotest.qspiders.com/api/course/get-special-courses?size=500`, {
                        headers: headers
                    });
                    this.special_course = classtiming.data
                }
                catch (err) {
                    console.log("errors:", err.response.data)
                }
            }
        },
    }

})

if (import.meta.hot) {
    import.meta.hot.accept(acceptHMRUpdate(counselorStore, import.meta.hot))
}