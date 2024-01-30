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
