import { createApp } from 'vue'
import App from './App.vue'
import { createPinia } from 'pinia'
import { routes } from './routes.js'
import { createRouter, createWebHistory } from 'vue-router'
import { darkModeKey, styleKey } from '@/config.js'
import VueQrcodeReader from "vue3-qrcode-reader";
import './css/main.css'

const app = createApp(App)

const router = createRouter({
  history: createWebHistory(),
  routes,
})
app.use(createPinia())
app.use(router)
app.use(VueQrcodeReader)
app.mount('#app')
