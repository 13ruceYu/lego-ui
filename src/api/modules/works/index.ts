import type { WorkRes } from './types'
import { axios } from '@/api/axios'

export function getMyWork(workId: string) {
  return axios<WorkRes>({
    url: `/works/${workId}`,
    method: 'get',
  })
}
