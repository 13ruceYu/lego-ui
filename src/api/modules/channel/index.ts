import type { ChannelList, CreateChannelPayload, CreateChannelRes } from './types'
import { axios } from '@/api/axios'

export function getWorkChannel(workId: number) {
  return axios<ChannelList>({
    url: `/channel/getWorkChannel/${workId}`,
    method: 'get',
  })
}

export function createChannel(data: CreateChannelPayload) {
  return axios<CreateChannelRes>({
    method: 'post',
    url: '/channel',
    data,
  })
}

export function deleteChannel(channelId: string) {
  return axios({
    method: 'delete',
    url: `/channel/${channelId}`,
  })
}
