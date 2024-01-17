import type { TemplatesRes } from './types'
import { axios } from '@/api/axios'

export function getTemplates() {
  return axios<TemplatesRes>({
    url: '/templates',
    method: 'get',
  })
}
