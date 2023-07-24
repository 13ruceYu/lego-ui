import type { RouteRecordRaw } from 'vue-router'

const basicPage: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: { name: 'home' },
    meta: { title: '首页' },
    children: [
      {
        path: '/home',
        name: 'home',
        component: () => import('@/views/home/Home.vue'),
        meta: {
          title: '首页',
          activeMenu: 'home',
          auth: [],
        },
      },
      {
        path: '/editor',
        name: 'editor',
        component: () => import('@/views/editor/Editor.vue'),
        meta: {
          title: '编辑页面',
        },
      },
    ],
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/login/Login.vue'),
  },
]

const routes: RouteRecordRaw[] = [...basicPage]

export default routes
