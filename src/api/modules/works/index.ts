import type { WorkRes, WorkUpdatePayload } from './types'
import { axios } from '@/api/axios'

export function getMyWork(workId: string) {
  return axios<WorkRes>({
    url: `/works/${workId}`,
    method: 'get',
  })
}

export function updateMyWork(workId: string, data: WorkUpdatePayload) {
  return axios({
    url: `/works/${workId}`,
    method: 'patch',
    data,
  })
}
