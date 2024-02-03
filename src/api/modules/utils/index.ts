import type { UploadRes } from './types'
import { axios } from '@/api/axios'

export function uploadImage(data: FormData) {
  return axios<UploadRes>({
    method: 'post',
    url: '/utils/upload-img',
    data,
  })
}
