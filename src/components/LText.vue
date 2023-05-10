<script lang="ts" setup>
import { pick } from 'lodash'
import { computed } from 'vue'
import {
  textDefaultProps,
  textStylePropNames,
  transformToComponentProps
} from '@/constants/defaultProps'

const props = defineProps({
  tag: {
    type: String,
    default: 'div'
  },
  ...transformToComponentProps(textDefaultProps)
})

const styleProps = computed(() => pick(props, textStylePropNames))
</script>

<template>
  <component :is="props.tag" :style="styleProps" class="l-text-component">{{
    props.text
  }}</component>
</template>
