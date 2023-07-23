import { defineStore } from 'pinia'

export interface UserProps {
  isLogin: boolean
  userName?: string
}

export const useUserStore = defineStore({
  id: 'user',
  state: (): UserProps => ({
    isLogin: false,
    userName: '',
  }),
  actions: {
    login() {
      this.isLogin = true
      this.userName = 'bobo'
    },
    logout() {
      this.isLogin = false
    },
  },
})
