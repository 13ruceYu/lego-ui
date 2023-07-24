<script lang="ts" setup>
import { textDefaultProps, textStylePropNames, transformToComponentProps } from '@/constants/defaultProps'
import useComponentCommon from '@/hooks/useComponentCommon'

const props = defineProps({
  tag: {
    type: String,
    default: 'div',
  },
  ...transformToComponentProps(textDefaultProps),
})

const { styleProps, handleClick } = useComponentCommon(props, textStylePropNames)
</script>

<template>
  <component
    :is="props.tag"
    :style="styleProps"
    class="l-text-component"
    style="position: relative"
    @click="handleClick"
  >
    {{ props.text }}
  </component>
</template>
