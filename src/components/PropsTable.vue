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
    {} as PropsToForms
  )
})
</script>

<template>
  <div class="props-table">
    <div v-for="(value, key) in finalProps" :key="key" class="prop-item">
      <component :is="value.component" v-if="value" :value="value.value"></component>
    </div>
  </div>
</template>
