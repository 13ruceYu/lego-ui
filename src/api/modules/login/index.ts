import type { PhoneReq, PhoneRes, UserRes, VerificationCodeReq, VerificationCodeRes } from './types'
import { axios } from '@/api/axios'

export function getVerificationCode(data: VerificationCodeReq) {
  return axios<VerificationCodeRes>({
    url: '/users/sendVeriCode',
    method: 'post',
    data,
  })
}

export function loginByPhone(data: PhoneReq) {
  return axios<PhoneRes>({
    url: '/users/loginByPhoneNumber',
    method: 'post',
    data,
  })
}

export function getUserInfo() {
  return axios<UserRes>({
    url: '/users/getUserInfo',
    method: 'get',
  })
}
