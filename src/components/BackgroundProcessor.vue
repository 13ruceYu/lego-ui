<script lang="ts" setup>
import { message } from 'ant-design-vue'
import ImageProcessor from './ImageProcessor.vue'
import StyledUploader from './StyledUploader.vue'
// import type { IUploadResp } from '@/types/uploadResp'

defineProps({ value: { type: String, default: '' } })
const emits = defineEmits(['change'])

function onImageUploaded(data: { resp: any; file: File }) {
  const { resp } = data
  message.success('上传成功')
  emits('change', resp.data[0])
}
function handleUploadUrl(url: string) {
  emits('change', url)
}
</script>

<template>
  <div class="background-processor">
    <StyledUploader
      v-if="!value"
      @success="onImageUploaded"
    />
    <ImageProcessor
      v-else
      :value="value"
      :show-delete="true"
      @change="handleUploadUrl"
    />
  </div>
</template>
