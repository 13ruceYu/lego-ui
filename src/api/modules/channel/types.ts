export interface ChannelList {
  count: number
  list: {
    id: number
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
