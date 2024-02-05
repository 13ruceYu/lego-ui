import type { ChannelList, CreateChannelPayload } from './types'
import { axios } from '@/api/axios'

export function getWorkChannel(workId: string) {
  return axios<ChannelList>({
    url: `/channel/getWorkChannel/${workId}`,
    method: 'get',
  })
}

export function createChannel(data: CreateChannelPayload) {
  return axios({
    method: 'post',
    url: '/channel',
    data,
  })
}
