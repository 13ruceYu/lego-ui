<script lang="ts" setup>
import { v4 as uuidv4 } from 'uuid'
import { message } from 'ant-design-vue'
import StyledUploader from './StyledUploader.vue'
import LText from './LText.vue'
import type { IUploadResp } from '@/types/uploadResp'
import type { ComponentData } from '@/store/editor/editor'
import { imageDefaultProps } from '@/constants/defaultProps'
import { getImageDimensions } from '@/utils/helper'

const props = defineProps({
  list: {
    type: Array,
    required: true,
    default: () => [],
  },
})

const emits = defineEmits(['onItemClick'])

function onClick(data: any) {
  emits('onItemClick', data)
}

function onImageUploaded(data: { resp: IUploadResp; file: File }) {
  const { resp, file } = data
  const componentData: ComponentData = {
    name: 'l-image',
    id: uuidv4(),
    props: {
      ...imageDefaultProps,
    },
  }
  message.success('上传成功')
  componentData.props.src = resp.data.url
  getImageDimensions(file).then(({ width }) => {
    const maxWidth = 373
    componentData.props.width = `${(width > maxWidth) ? maxWidth : width}px`
    emits('onItemClick', componentData)
  })
}
</script>

<template>
  <div class="create-component-list">
    <div v-for="(item, index) in props.list" :key="index" class="component-item flex justify-center p-1" @click="onClick(item)">
      <LText v-bind="item" />
    </div>
    <div class="flex justify-center p-1">
      <StyledUploader @success="onImageUploaded" />
    </div>
  </div>
</template>
