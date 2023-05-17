import { Input, InputNumber, Radio, Select, Slider } from 'ant-design-vue'
import type { PropType, VNode } from 'vue'
import { computed, defineComponent } from 'vue'

interface FormProps {
  component: string
  extraProps?: { [key: string]: any }
  value: string
  text: string
  subComponent?: string
  options?: { text: string | VNode; value: any }[]
  initialTransform?: (v: any) => any
  valueProp: string
  eventName: string
  events: { [key: string]: (e: any) => void }
}

const mapToComponent = {
  'a-textarea': Input.TextArea,
  'a-input-number': InputNumber,
  'a-slider': Slider,
  'a-radio-group': Radio.Group,
  'a-radio-button': Radio.Button,
  'a-select': Select,
  'a-select-option': Select.Option
} as any

export default defineComponent({
  props: {
    finalPropsItem: {
      type: Object as PropType<FormProps>,
      default: () => ({})
    }
  },
  setup(props) {
    const compName = computed(() => props.finalPropsItem.component)
    const compOptions = computed(() => props.finalPropsItem.options)
    const subCompName = computed(() => props.finalPropsItem.subComponent)
    const compProps = computed(() => ({
      [props.finalPropsItem.valueProp]: props.finalPropsItem.value,
      ...props.finalPropsItem.extraProps,
      ...props.finalPropsItem.events
    }))
    return {
      compName,
      subCompName,
      compProps,
      compOptions
    }
  },
  render() {
    const { compName, subCompName, compProps, compOptions } = this
    const Comp = mapToComponent[compName]
    const SubComp = subCompName ? mapToComponent[subCompName] : null
    return (
      <Comp {...compProps}>
        {compOptions &&
          compOptions.map((option) => {
            return <SubComp value={option.value}>{option.text}</SubComp>
          })}
      </Comp>
    )
  }
})
