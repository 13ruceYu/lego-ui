import { createRouter, createWebHistory } from 'vue-router'
import routes from './routes'

const router = createRouter({
  history: createWebHistory(
    import.meta.env.MODE === 'production' ? '/dolphinscheduler/ui/' : '/'
  ),
  routes
})

export default router
