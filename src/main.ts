import { createApp } from 'vue'
import Antd, { message } from 'ant-design-vue'
import type { MessageApi } from 'ant-design-vue/lib/message'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'

import './styles/index.css'
import 'ant-design-vue/dist/antd.css' // or 'ant-design-vue/dist/antd.less'
import 'cropperjs/dist/cropper.css'

export const baseH5URL = 'http://182.92.168.192:8082'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(Antd)
app.use(router)
app.mount('#app')

declare global {
  interface Window {
    $message: MessageApi
  }
}

window.$message = message
