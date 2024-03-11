import { defineStore, acceptHMRUpdate } from 'pinia'

import { themeStore } from "../stores/theme"
import firebase from 'firebase/app'
import "firebase/auth";


export const firebaseStore = defineStore('fire', {
    state: () => ({
        firebaseConfig  : {

            apiKey: "AIzaSyBWZrGUnxCm3bn40sj6RptumLtRRDU2h2s",
          
            authDomain: "qspiders-management-81868.firebaseapp.com",
          
            projectId: "qspiders-management-81868",
          
            storageBucket: "qspiders-management-81868.appspot.com",
          
            messagingSenderId: "145290372684",
          
            appId: "1:145290372684:web:a3ad0281050492a9ebf6e9",
          
            measurementId: "G-RMM3K51JCR"
          
          },
          app : null,
          auth : null
    }),
    actions: {
        async initiateFirebase() {
            firebase.initializeApp(this.firebaseConfig);
        },
        async initiateAuth() {
            this.auth =  firebase.auth();
            console.log("this.auth",this.auth)

        },

    }
    })

    if (import.meta.hot) {
        import.meta.hot.accept(acceptHMRUpdate(firebaseStore, import.meta.hot))
    }