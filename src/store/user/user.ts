import { defineStore } from 'pinia'
import { axios } from '@/api/axios'
import { getUserInfo, loginByPhone } from '@/api/modules/login'
import type { UserRes } from '@/api/modules/login/types'

export interface UserProps {
  isLogin: boolean
  data: UserRes
  token: string
}

export const useUserStore = defineStore({
  id: 'user',
  state: (): UserProps => ({
    isLogin: false,
    data: {},
    token: '',
  }),
  actions: {
    async login(phoneNumber: string, veriCode: string) {
      const rawData = await loginByPhone({ phoneNumber, veriCode })
      const { token } = rawData
      this.token = token
      axios.defaults.headers.common.Authorization = `Bearer ${token}`
      localStorage.setItem('token', token)
    },
    async fetchCurrentUser() {
      const res = await getUserInfo()
      this.isLogin = true
      this.data = res
    },
  },
})
