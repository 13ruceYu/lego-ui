import type { RouteRecordRaw } from 'vue-router'

const basicPage: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'index',
    component: () => import('@/views/Index.vue'),
    children: [
      { path: '', name: 'home', component: () => import('@/views/home/Home.vue'), meta: { title: '欢迎来到慕课乐高' } },
      { path: 'template/:id', name: 'template', component: () => import('@/views/template/TemplateDetail.vue'), meta: { title: '模版详情' } },
      { path: 'works', name: 'works', component: () => import('@/views/work/Work.vue'), meta: { title: '我的作品', requiredLogin: true } },
      {
        path: '/setting',
        name: 'setting',
        component: () => import('@/views/setting/Setting.vue'),
        meta: { title: '设置', requiredLogin: true },
      },
    ],
  },
  {
    path: '/editor/:id?',
    name: 'editor',
    component: () => import('@/views/editor/Editor.vue'),
    meta: {
      title: '编辑页面',
      requiredLogin: true,
    },
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/login/Login.vue'),
    meta: {
      title: '欢迎登录',
      redirectAlreadyLogin: true,
    },
  },
  {
    path: '/oauth',
    name: 'oauth',
    component: () => import('@/views/oauth/Oauth.vue'),
  },
]

const routes: RouteRecordRaw[] = [...basicPage]

export default routes
