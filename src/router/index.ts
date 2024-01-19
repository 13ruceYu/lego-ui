import { createRouter, createWebHistory } from 'vue-router'
import routes from './routes'
import { useUserStore } from '@/store/user/user'
import { axios } from '@/api/axios'

const router = createRouter({
  history: createWebHistory(
    import.meta.env.MODE === 'production' ? '/dolphinscheduler/ui/' : '/',
  ),
  routes,
})

router.beforeEach(async (to) => {
  const userStore = useUserStore()
  const { isLogin, token } = userStore
  const { title, requiredLogin, redirectAlreadyLogin } = to.meta
  if (title)
    document.title = title as string

  if (!isLogin) {
    if (token) {
      axios.defaults.headers.common.Authorization = `Bearer ${token}`
      try {
        await userStore.fetchCurrentUser()
        if (redirectAlreadyLogin)
          return '/'
      }
      catch {
        window.$message.error('登录状态已过期', 2)
        userStore.logout()
        return '/login'
      }
    }
    else {
      if (requiredLogin)
        return { name: 'login' }
    }
  }
  else {
    if (redirectAlreadyLogin)
      return '/'
  }
})

export default router
