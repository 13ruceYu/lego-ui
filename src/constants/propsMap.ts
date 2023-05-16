import type { TextComponentProps } from './defaultProps'

export interface PropToForm {
  component: string
  extraProps?: { [key: string]: any }
  text: string
  subComponent?: string
  options?: { text: string; value: any }[]
  initialTransform?: (v: any) => any
  afterTransform?: (v: any) => any
  valueProp?: string
  eventName?: string
}

export type PropsToForms = {
  [P in keyof TextComponentProps]?: PropToForm
}

export const mapPropsToForms: PropsToForms = {
  text: {
    component: 'a-textarea',
    extraProps: { rows: 3 },
    text: '文本',
    afterTransform: (e: any) => e.target.value
  },
  fontSize: {
    component: 'a-input-number',
    text: '字体',
    initialTransform: (v: string) => parseInt(v),
    afterTransform: (e: number) => (e ? `${e}px` : '')
  },
  lineHeight: {
    component: 'a-slider',
    extraProps: { min: 0, max: 3, step: 0.1 },
    text: '行高',
    initialTransform: (v: string) => parseFloat(v)
  },
  textAlign: {
    component: 'a-radio-group',
    text: '对齐',
    subComponent: 'a-radio-button',
    options: [
      { value: 'left', text: '左' },
      { value: 'center', text: '中' },
      { value: 'right', text: '右' }
    ],
    afterTransform: (e: any) => e.target.value
  },
  fontFamily: {
    component: 'a-select',
    text: '字体',
    subComponent: 'a-select-option',
    options: [
      { text: '无', value: '' },
      { text: '宋体', value: '"SimSun","STSong"' },
      { text: '黑体', value: '"SimHei","STHeiTi"' },
      { text: '楷体', value: '"KaiTi", "STKaiTi"' }
    ]
  }
}
