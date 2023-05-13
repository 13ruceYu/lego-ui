<script lang="ts" setup>
import type { PropType } from 'vue'
import { computed } from 'vue'
import { reduce } from 'lodash'
import type { TextComponentProps } from '@/constants/defaultProps'
import type { PropsToForms } from '@/constants/propsMap'
import { mapPropsToForms } from '@/constants/propsMap'

const props = defineProps({
  props: {
    type: Object as PropType<Partial<TextComponentProps>>,
    required: true
  }
})

const finalProps = computed(() => {
  return reduce(
    props.props,
    (result, value, key) => {
      const newKey = key as keyof TextComponentProps
      const item = mapPropsToForms[newKey]
      if (item) {
        item.value = item.initialTransform ? item.initialTransform(value) : value
        item.valueProp = item.valueProp ? item.valueProp : 'value'
        result[newKey] = item
      }
      return result
    },
    {} as Required<PropsToForms>
  )
})

function returnString(val: any): string {
  return `${val}`
}
</script>

<template>
  <div class="props-table">
    <div v-for="(item, key) in finalProps" :key="key" class="prop-item flex mb-2">
      <div class="label flex-shrink-0 mr-2 leading-8">{{ item.text }}</div>
      <component
        :is="item.component"
        v-if="item"
        :[returnString(item.valueProp)]="item.value"
        v-bind="item.extraProps"
        class="grow"
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
