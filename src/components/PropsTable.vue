<script lang="ts" setup>
import type { VNode } from 'vue'
import { computed } from 'vue'
import { reduce } from 'lodash'
import ColorPicker from './ColorPicker.vue'
import ImageProcessor from './ImageProcessor.vue'
import BackgroundProcessor from './BackgroundProcessor.vue'
import ShadowPicker from './ShadowPicker.vue'
import IconSwitch from './IconSwitch.vue'
import RenderVNode from './RenderVNode'
import type { TextComponentProps } from '@/constants/defaultProps'
import { mapPropsToForms } from '@/constants/propsMap'

const props = defineProps({
  props: {
    type: Object,
    required: true,
  },
})

const emits = defineEmits(['change'])

defineOptions({
  components: { ColorPicker, ImageProcessor, ShadowPicker, IconSwitch, BackgroundProcessor },
})

interface FormProps {
  component: string
  extraProps?: { [key: string]: any }
  value: string
  text?: string
  subComponent?: string
  options?: { text: string | VNode; value: any }[]
  initialTransform?: (v: any) => any
  valueProp: string
  eventName: string
  events: { [key: string]: (e: any) => void }
}

const finalProps = computed(() => {
  return reduce(
    props.props,
    (result, value, key) => {
      const newKey = key as keyof TextComponentProps
      const item = mapPropsToForms[newKey]
      if (item) {
        const { valueProp = 'value', eventName = 'change', initialTransform, afterTransform } = item
        const newItem: FormProps = {
          ...item,
          value: initialTransform ? initialTransform(value) : value,
          valueProp,
          eventName,
          events: {
            [eventName]: (e: any) => emits('change', { key, value: afterTransform ? afterTransform(e) : e }),
          },
        }
        result[newKey] = newItem
      }
      return result
    },
    {} as { [key: string]: FormProps },
  )
})
</script>

<template>
  <div class="props-table">
    <div v-for="(item, key) in finalProps" :key="key" class="prop-item flex mb-2">
      <div v-if="item.text" class="label flex-shrink-0 mr-2 leading-8">
        {{ item.text }}
      </div>
      <component
        :is="item.component" v-if="item" :[item.valueProp]="item.value" v-bind="item.extraProps" class="grow"
        v-on="item.events"
      >
        <template v-if="item.options && item.subComponent">
          <component :is="item.subComponent" v-for="(option, k) in item.options" :key="k" :value="option.value">
            <RenderVNode :custom-node="option.text" />
          </component>
        </template>
      </component>
    </div>
  </div>
</template>
