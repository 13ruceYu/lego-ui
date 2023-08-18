<script lang="ts" setup>
import axios from 'axios'
import { computed, reactive, ref } from 'vue'
import { v4 as uuidv4 } from 'uuid'
import { DeleteOutlined } from '@ant-design/icons-vue'

type TUploadStatus = 'ready' | 'loading' | 'success' | 'error'
interface IUploadFile {
  uid: string
  size: number
  name: string
  status: TUploadStatus
  raw: File
}

const props = defineProps({
  action: {
    type: String,
    required: true,
  },
})

const fileInput = ref<null | HTMLInputElement>(null)
const uploadedFiles = ref<IUploadFile[]>([])

const isUploading = computed(() => {
  return uploadedFiles.value.some(file => file.status === 'loading')
})

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
    const fileObj = reactive<IUploadFile>({
      uid: uuidv4(),
      size: uploadedFile.size,
      name: uploadedFile.name,
      status: 'loading',
      raw: uploadedFile,
    })
    uploadedFiles.value.push(fileObj)
    axios.post(props.action, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }).then(() => {
      fileObj.status = 'success'
    }).catch(() => {
      fileObj.status = 'error'
    }).finally(() => {
      fileInput.value && (fileInput.value.value = '')
    })
  }
}

function removeFile(id: string) {
  uploadedFiles.value = uploadedFiles.value.filter(file => file.uid !== id)
}
</script>

<template>
  <div class="file-upload">
    <button class="button" :disabled="isUploading" @click="triggerUpload">
      <span v-if="isUploading">正在上传</span>
      <span v-else>点击上传</span>
    </button>
    <input ref="fileInput" type="file" style="display: none" @change="handleFileChange">
    <ul>
      <li v-for="(file, index) in uploadedFiles" :key="index" class="flex justify-between" :class="`upload-${file.status}`">
        <span class="filename">{{ file.name }}</span>
        <button class="delete-icon" @click="removeFile(file.uid)">
          <DeleteOutlined />
        </button>
      </li>
    </ul>
  </div>
</template>
