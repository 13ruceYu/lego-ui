import type { TemplateProps } from '@/store/template/template'

interface TemplatesRes {
  list: TemplateProps[]
  count: number
  pageSize: number
  pageIndex: number
}

export type { TemplatesRes }
