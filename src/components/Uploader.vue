<script lang="ts" setup>
import axios from 'axios'
import { ref } from 'vue'

type TUploadStatus = 'ready' | 'loading' | 'success' | 'error'

const props = defineProps({
  action: {
    type: String,
    required: true,
  },
})

const fileInput = ref<null | HTMLInputElement>(null)
const fileStatus = ref<TUploadStatus>('ready')

function triggerUpload() {
  if (fileInput.value)
    fileInput.value.click()
}

function handleFileChange(e: Event) {
  const target = e.target as HTMLInputElement
  const files = target.files
  if (files) {
    const uploadedFile = files[0]
    const formData = new FormData()
    formData.append(uploadedFile.name, uploadedFile)
    axios.post(props.action, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }).then(() => {
      fileStatus.value = 'success'
    }).catch(() => {
      fileStatus.value = 'error'
    })
  }
}
</script>

<template>
  <div class="file-upload">
    <button @click="triggerUpload">
      <span v-if="fileStatus === 'success'">正在上传</span>
      <span v-else-if="fileStatus === 'loading'">上传成功</span>
      <span v-else-if="fileStatus === 'error'">上传失败</span>
      <span v-else>点击上传</span>
    </button>
    <input ref="fileInput" type="file" style="display: none" @change="handleFileChange">
  </div>
</template>
