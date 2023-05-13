<script lang="ts" setup>
import type { PropType } from 'vue'
import { computed } from 'vue'
import { reduce } from 'lodash'
import type { TextComponentProps } from '@/constants/defaultProps'
import { mapPropsToForms } from '@/constants/propsMap'

const props = defineProps({
  props: {
    type: Object as PropType<Partial<TextComponentProps>>,
    required: true
  }
})

const emits = defineEmits(['change'])

interface FormProps {
  component: string
  extraProps?: { [key: string]: any }
  value: string
  text: string
  subComponent?: string
  options?: { text: string; value: any }[]
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
        const { valueProp = 'value', eventName = 'change', initialTransform } = item
        const newItem: FormProps = {
          ...item,
          value: initialTransform ? initialTransform(value) : 'value',
          valueProp,
          eventName,
          events: {
            [eventName]: (e: any) => emits('change', { key, value: e })
          }
        }
        result[newKey] = newItem
      }
      return result
    },
    {} as { [key: string]: FormProps }
  )
})
</script>

<template>
  <div class="props-table">
    <div v-for="(item, key) in finalProps" :key="key" class="prop-item flex mb-2">
      <div class="label flex-shrink-0 mr-2 leading-8">{{ item.text }}</div>
      <component
        :is="item.component"
        v-if="item"
        :[item.valueProp]="item.value"
        v-bind="item.extraProps"
        class="grow"
        v-on="item.events"
      >
        <template v-if="item.options && item.subComponent">
          <component :is="item.subComponent" v-for="(option, k) in item.options" :key="k" :value="option.value">{{
            option.text
          }}</component>
        </template>
      </component>
    </div>
  </div>
</template>
