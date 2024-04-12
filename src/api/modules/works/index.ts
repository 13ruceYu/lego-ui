import type { Template, TemplateListRes, WorkRes, WorkUpdatePayload } from './types'
import { axios } from '@/api/axios'

export function getMyWork(workId: string) {
  return axios<WorkRes>({
    url: `/works/${workId}`,
    method: 'get',
  })
}

export function getMyWorkList() {
  return axios({
    url: '/works',
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

export function getTemplateById(templateId: string) {
  return axios<Template>({
    url: `/templates/${templateId}`,
    method: 'get',
  })
}

export function getCommonTemplates() {
  return axios<TemplateListRes>({
    method: 'get',
    url: '/templates',
  })
}

export function publishWork(workId: number) {
  return axios({
    method: 'post',
    url: `/works/publish/${workId}`,
  })
}

export function createWork(data: any) {
  return axios({
    method: 'post',
    url: '/works',
    data,
  })
}

export function createWorkByTemplate(workId: string) {
  return axios({
    method: 'post',
    url: '/works/by-template',
    data: {
      id: workId,
    },
  })
}
