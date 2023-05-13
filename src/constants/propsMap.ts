import type { TextComponentProps } from './defaultProps'

export interface PropToForm {
  component: string
  extraProps?: { [key: string]: any }
  text: string
  subComponent?: string
  options?: { text: string; value: any }[]
  initialTransform?: (v: any) => any
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
    text: '文本'
  },
  fontSize: {
    component: 'a-input-number',
    text: '字体'
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
      { value: 'right', text: '右' },
      { value: 'center', text: '中' }
    ]
  }
}
