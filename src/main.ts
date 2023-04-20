import { createApp } from 'vue'
import Antd from 'ant-design-vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'

import './styles/index.css'
import 'ant-design-vue/dist/antd.css'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(Antd)
app.use(router)
app.mount('#app')
