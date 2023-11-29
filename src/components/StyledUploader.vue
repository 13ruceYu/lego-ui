<script lang="ts" setup>
import { FileImageOutlined, LoadingOutlined } from '@ant-design/icons-vue'
import Uploader from './Uploader.vue'
import { commonUploadCheck } from '@/utils/helper'

const emits = defineEmits(['success'])

function handleUploadSuccess(resp: any, file: File) {
  emits('success', { resp, file })
}
</script>

<template>
  <Uploader
    class="styled-uploader"
    action="/api/utils/upload-img"
    :show-upload-list="false"
    :before-upload="commonUploadCheck"
    @success="
      (data) => {
        handleUploadSuccess(data.resp, data.file.raw)
      }
    "
  >
    <div class="uploader-container">
      <a-button type="primary">
        <template #icon>
          <FileImageOutlined />
        </template>
        上传图片
      </a-button>
    </div>
    <template #loading>
      <div class="uploader-container">
        <a-button type="primary">
          <template #icon>
            <LoadingOutlined spin />
          </template>
          上传中
        </a-button>
      </div>
    </template>
    <template #uploaded>
      <div class="uploader-container">
        <a-button type="primary">
          <template #icon>
            <FileImageOutlined />
          </template>
          上传图片
        </a-button>
      </div>
    </template>
  </Uploader>
</template>
