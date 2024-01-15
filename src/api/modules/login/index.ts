import type { VerificationCodeReq, VerificationCodeRes } from './types'
import { axios } from '@/api/axios'

export function getVerificationCode(data: VerificationCodeReq) {
  return axios<VerificationCodeRes>({
    url: '/users/sendVeriCode',
    method: 'post',
    data,
  })
}
