import type { RouteRecordRaw } from 'vue-router'

const basicPage: RouteRecordRaw[] = [
  {
    path: '/',
    meta: { title: '首页' },
    component: () => import('@/views/home/Home.vue')
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/login/Login.vue')
  }
]

const routes: RouteRecordRaw[] = [...basicPage]

export default routes
