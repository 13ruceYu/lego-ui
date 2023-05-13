import type { TextComponentProps } from './defaultProps'

export interface PropToForm {
  component: string
  value?: string
  extraProps?: { [key: string]: any }
  text: string
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
    text: '行高'
  }
}
