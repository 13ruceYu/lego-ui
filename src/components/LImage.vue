<script lang="ts" setup>
import useComponentCommon from '../hooks/useComponentCommon'
import { imageDefaultProps, imageStylePropsNames, transformToComponentProps } from '@/constants/defaultProps'

const props = defineProps({ ...transformToComponentProps(imageDefaultProps) })
const { styleProps, handleClick } = useComponentCommon(props, imageStylePropsNames)
</script>

<template>
  <img
    :style="styleProps as any"
    class="l-image-component"
    :src="src"
    @click.prevent="handleClick"
  >
</template>

<style scoped>
.l-image-component {
  max-width: 100%;
  position: relative !important;
}
</style>
