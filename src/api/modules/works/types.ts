import type { IComponentData, PageData, PageProps } from '@/store/editor/editor'

export interface WorkRes extends Omit<PageData, 'props'> {
  title: string
  content: {
    components: IComponentData[]
    props?: PageProps
  }
}

export interface WorkUpdatePayload extends PageData {
  content: {
    components: IComponentData[]
    props?: PageProps
  }
}

export interface Template {
  '_id': string
  'id': number
  'title': string
  'desc': string
  'author': string
  'coverImg': string
  'copiedCount': number
  'isHot': boolean
  'createdAt': string
}

export interface TemplateListRes {
  list: Template[]
  'count': number
  'pageSize': number
  'pageIndex': number
}
