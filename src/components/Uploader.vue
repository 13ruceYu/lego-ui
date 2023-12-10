<script lang="ts" setup>
import axios from 'axios'
import type { PropType } from 'vue'
import { computed, reactive, ref } from 'vue'
import { v4 as uuidv4 } from 'uuid'
import { DeleteOutlined } from '@ant-design/icons-vue'
import { last } from 'lodash'

const props = defineProps({
  action: {
    type: String,
    required: true,
  },
  beforeUpload: {
    type: Function as PropType<TCheckUpload>,
  },
  drag: {
    type: Boolean,
    default: false,
  },
  autoUpload: {
    type: Boolean,
    default: true,
  },
  listType: {
    type: String,
    default: 'text',
  },
  showUploadList: {
    type: Boolean,
    default: true,
  },
})

const emits = defineEmits(['success'])

defineExpose({
  uploadFiles,
})

type TUploadStatus = 'ready' | 'loading' | 'success' | 'error'
type TCheckUpload = (file: File) => boolean | Promise<File>
interface IUploadFile {
  uid: string
  size: number
  name: string
  status: TUploadStatus
  raw: File
  resp?: any
  url?: string
}

const fileInput = ref<null | HTMLInputElement>(null)
const filesList = ref<IUploadFile[]>([])
const isDragOver = ref(false)

let events: { [key: string]: (e: any) => void } = {
  click: triggerUpload,
}
if (props.drag) {
  events = {
    ...events,
    dragover: (e: DragEvent) => { handleDrag(e, true) },
    dragleave: (e: DragEvent) => { handleDrag(e, false) },
    drop: handleDrop,
  }
}

const isUploading = computed(() => {
  return filesList.value.some(file => file.status === 'loading')
})

const lastFileData = computed(() => {
  const lastFile = last(filesList.value)
  if (lastFile) {
    return {
      loaded: lastFile.status === 'success',
      data: lastFile.resp,
    }
  }
  return false
})

function handleDrag(e: DragEvent, over: boolean) {
  e.preventDefault()
  isDragOver.value = over
}

function handleDrop(e: DragEvent) {
  e.preventDefault()
  isDragOver.value = false
  if (e.dataTransfer)
    beforeUploadCheck(e.dataTransfer.files)
}

function triggerUpload() {
  if (fileInput.value)
    fileInput.value.click()
}

function postFile(readyFile: IUploadFile) {
  const formData = new FormData()
  formData.append(readyFile.name, readyFile.raw)
  readyFile.status = 'loading'
  axios.post(props.action, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
      'Authorization': `Bearer ${import.meta.env.VITE_TOKEN}`,
    },
  }).then((resp) => {
    readyFile.status = 'success'
    readyFile.resp = resp.data
    emits('success', { resp: resp.data, file: readyFile, list: filesList.value })
  }).catch(() => {
    readyFile.status = 'error'
  }).finally(() => {
    fileInput.value && (fileInput.value.value = '')
  })
}

// addFileToList
function addFileToList(uploadedFile: File) {
  const fileObj = reactive<IUploadFile>({
    uid: uuidv4(),
    size: uploadedFile.size,
    name: uploadedFile.name,
    status: 'ready',
    raw: uploadedFile,
  })
  if (props.listType === 'picture') {
    try {
      fileObj.url = URL.createObjectURL(uploadedFile)
    }
    catch (error) {
      console.error('upload File error', error)
    }
  }
  filesList.value.push(fileObj)
  if (props.autoUpload)
    postFile(fileObj)
}

function uploadFiles() {
  filesList.value.filter(file => file.status === 'ready').forEach(readyFile => postFile(readyFile))
}

function beforeUploadCheck(files: null | FileList) {
  if (files) {
    const uploadedFile = files[0]
    if (props.beforeUpload) {
      const result = props.beforeUpload(uploadedFile)
      if (result && result instanceof Promise) {
        result.then((processedFile) => {
          if (processedFile instanceof File)
            addFileToList(processedFile)
          else
            throw new Error('beforeUpload Promise should return File object')
        }).catch((e) => {
          console.error(e)
        })
      }
      else if (result === true) {
        addFileToList(uploadedFile)
      }
    }
    else {
      addFileToList(uploadedFile)
    }
  }
}

function handleFileChange(e: Event) {
  const target = e.target as HTMLInputElement
  const files = target.files
  beforeUploadCheck(files)
}

function removeFile(id: string) {
  filesList.value = filesList.value.filter(file => file.uid !== id)
}
</script>

<template>
  <div class="file-upload">
    <div class="upload-area" :class="[drag && isDragOver ? 'is-dragover border-cyan-400 bg-cyan-300' : '']" v-on="events">
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
    <ul v-if="showUploadList" :class="`upload-list upload-list-${listType}`">
      <li v-for="(file, index) in filesList" :key="index" class="flex justify-between" :class="`upload-${file.status}`">
        <span v-if="file.url"><img :src="file.url" :alt="file.name"></span>
        <span class="filename">{{ file.name }}</span>
        <button class="delete-icon" @click="removeFile(file.uid)">
          <DeleteOutlined />
        </button>
      </li>
    </ul>
  </div>
</template>
