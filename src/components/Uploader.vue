<script lang="ts" setup>
import axios from 'axios'
import type { PropType } from 'vue'
import { computed, reactive, ref } from 'vue'
import { v4 as uuidv4 } from 'uuid'
import { DeleteOutlined } from '@ant-design/icons-vue'
import { last } from 'lodash'

type TUploadStatus = 'ready' | 'loading' | 'success' | 'error'
type TCheckUpload = (file: File) => boolean | Promise<File>
interface IUploadFile {
  uid: string
  size: number
  name: string
  status: TUploadStatus
  raw: File
  resp?: any
}

const props = defineProps({
  action: {
    type: String,
    required: true,
  },
  beforeUpload: {
    type: Function as PropType<TCheckUpload>,
  },
})

const fileInput = ref<null | HTMLInputElement>(null)
const uploadedFiles = ref<IUploadFile[]>([])

const isUploading = computed(() => {
  return uploadedFiles.value.some(file => file.status === 'loading')
})

const lastFileData = computed(() => {
  const lastFile = last(uploadedFiles.value)
  if (lastFile) {
    return {
      loaded: lastFile.status === 'success',
      data: lastFile.resp,
    }
  }
  return false
})

function triggerUpload() {
  if (fileInput.value)
    fileInput.value.click()
}

function postFile(uploadedFile: File) {
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
  }).then((resp) => {
    fileObj.status = 'success'
    fileObj.resp = resp.data
  }).catch(() => {
    fileObj.status = 'error'
  }).finally(() => {
    fileInput.value && (fileInput.value.value = '')
  })
}

function handleFileChange(e: Event) {
  const target = e.target as HTMLInputElement
  const files = target.files
  if (files) {
    const uploadedFile = files[0]
    if (props.beforeUpload) {
      const result = props.beforeUpload(uploadedFile)
      if (result && result instanceof Promise) {
        result.then((processedFile) => {
          if (processedFile instanceof File)
            postFile(processedFile)
          else
            throw new Error('beforeUpload Promise should return File object')
        }).catch((e) => {
          console.error(e)
        })
      }
      else if (result === true) {
        postFile(uploadedFile)
      }
    }
    else {
      postFile(uploadedFile)
    }
  }
}

function removeFile(id: string) {
  uploadedFiles.value = uploadedFiles.value.filter(file => file.uid !== id)
}
</script>

<template>
  <div class="file-upload">
    <div class="upload-area" @click="triggerUpload">
      <slot v-if="isUploading" name="loading">
        <button disabled>
          正在上传
        </button>
      </slot>
      <slot v-else-if="lastFileData && lastFileData.loaded" name="uploaded" :uploaded-data="lastFileData.data">
        <button>点击上传</button>
      </slot>
      <slot v-else>
        <button>点击上传</button>
      </slot>
    </div>
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
