import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from './router/router'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import App from './App.vue'
import './style.css'

const pinia = createPinia()
createApp(App).use(ElementPlus).use(pinia).use(router).mount('#app')