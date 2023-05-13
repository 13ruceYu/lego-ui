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
        item.value = value
        result[newKey] = item
      }
      return result
    },
    {} as Required<PropsToForms>
  )
})
</script>

<template>
  <div class="props-table">
    <div v-for="(value, key) in finalProps" :key="key" class="prop-item flex mb-2">
      <div class="label flex-shrink-0 mr-2 leading-8">{{ value.text }}</div>
      <component :is="value.component" v-if="value" :value="value.value" v-bind="value.extraProps"></component>
    </div>
  </div>
</template>
