export interface ChannelList {
  count: number
  list: {
    id: string
    name: string
    workId: number
    status: number
    createdAt: string
    updatedAt: string
  }[]
}

export interface CreateChannelPayload {
  workId: number
  name: string
}

export interface CreateChannelRes {
  name: string
  id: string
}
