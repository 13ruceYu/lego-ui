<script lang="ts">
import { defineComponent } from 'vue'
import useComponentCommon from '../hooks/useComponentCommon'
import { imageDefaultProps, imageStylePropsNames, transformToComponentProps } from '@/constants/defaultProps'

const defaultProps = transformToComponentProps(imageDefaultProps)

// array that contains style props
export default defineComponent({
  name: 'LImage',
  props: {
    ...defaultProps,
  },
  setup(props) {
    // 重用并且简化
    // 抽离并且获得 styleProps
    const { styleProps, handleClick } = useComponentCommon(props, imageStylePropsNames)
    return {
      styleProps,
      handleClick,
    }
  },
})
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
