import { createRouter, createWebHistory } from 'vue-router'
import routes from './routes'
import { axios } from '@/api/axios'
import { useUserStore } from '@/store/user/user'

const router = createRouter({
  history: createWebHistory(),
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
