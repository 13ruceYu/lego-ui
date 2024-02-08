<script lang="ts">
import { computed, defineComponent, onMounted, reactive } from 'vue'
import { Form } from 'ant-design-vue'
import { forEach } from 'lodash'
import StyledUploader from '../../components/StyledUploader.vue'
import { useSaveWork } from './useSaveWork'
import type { IUploadResp } from '@/types/uploadResp'
import { baseH5URL } from '@/main'
import { generateQRCode, timeout } from '@/utils/helper'
import { useEditorStore } from '@/store/editor/editor'

export default defineComponent({
  components: {
    StyledUploader,
  },
  props: {
    visible: {
      type: Boolean,
      defaults: false,
    },
  },
  emits: ['update:visible'],
  setup(props, { emit }) {
    const store = useEditorStore()
    const pageState = computed(() => store.page)
    const previewURL = computed(() => `${baseH5URL}/p/preview/${pageState.value.id}-${pageState.value.uuid}`)
    const { title, desc, setting } = pageState.value
    const { saveWork, saveLoading } = useSaveWork(true)
    const form = reactive({
      title: title || '',
      desc: desc || '',
      uploaded: { data: { url: (setting && setting.shareImg) || 'http://vue-maker.oss-cn-hangzhou.aliyuncs.com/vue-marker/5f79389d4737571e2e1dc7cb.png' } },
    })
    const rules = reactive({
      title: [
        { required: true, message: '标题不能为空', trigger: 'blur' },
      ],
      desc: [
        { required: true, message: '描述不能为空', trigger: 'blur' },
      ],
    })

    onMounted(async () => {
      try {
        await timeout(100)
        await generateQRCode('preview-barcode-container', previewURL.value)
      }
      catch (e) {
        console.error(e)
      }
    })
    const updateAvatar = (rawData: { resp: IUploadResp; file: File }) => {
      const url = rawData.resp.data[0]
      form.uploaded = {
        data: { url },
      }
    }
    const { validate } = Form.useForm(form, rules)
    const validateAndSave = async () => {
      await validate()
      forEach(form, (value, key) => {
        if (key === 'uploaded' && typeof value !== 'string')
          store.updatePage({ key: 'shareImg', value: value.data.url, isSetting: true })
        else
          store.updatePage({ key, value, isRoot: true })
      })
      await saveWork()
      emit('update:visible', false)
    }
    const onCancel = () => {
      emit('update:visible', false)
    }
    return {
      pageState,
      previewURL,
      form,
      rules,
      saveLoading,
      validateAndSave,
      onCancel,
      updateAvatar,
    }
  },
})
</script>

<template>
  <div v-if="visible" class="preview-form">
    <div class="final-preview">
      <div class="final-preview-inner">
        <div class="preview-title">
          {{ pageState.title }}
        </div>
        <div class="iframe-container">
          <iframe
            :src="previewURL" width="375" frameborder="0" class="iframe-placeholder"
            :height="(pageState.props && pageState.props.height) ? pageState.props.height : '560'"
          />
        </div>
      </div>
    </div>
    <a-drawer
      title="设置面板"
      placement="right"
      width="400"
      :closable="true"
      :visible="visible"
      @close="onCancel"
    >
      <div class="publish-form-container">
        <a-row type="flex" align="middle" :style="{ marginBottom: '20px' }">
          <a-col :span="6">
            扫码预览：
          </a-col>
          <a-col :span="10">
            <canvas id="preview-barcode-container" />
          </a-col>
        </a-row>
        <a-row type="flex" align="middle" :style="{ marginBottom: '20px' }">
          <a-col :span="6">
            上传封面：
          </a-col>
          <a-col :span="10">
            <StyledUploader
              text="上传封面"
              :uploaded="form.uploaded"
              show-uploaded
              @success="updateAvatar"
            />
          </a-col>
        </a-row>
        <a-form
          :label-col="{ span: 6 }" :wrapper-col="{ span: 16 }"
          :model="form" :rules="rules"
        >
          <a-form-item label="标题" required name="title">
            <a-input v-model:value="form.title" />
          </a-form-item>
          <a-form-item label="描述" required name="desc">
            <a-input v-model:value="form.desc" />
          </a-form-item>
          <a-form-item :wrapper-col="{ span: 18, offset: 4 }">
            <a-button type="primary" style="margin-left: 10px;" :loading="saveLoading" @click="validateAndSave">
              保存
            </a-button>
            <a-button style="margin-left: 10px;" @click="onCancel">
              取消
            </a-button>
          </a-form-item>
        </a-form>
      </div>
    </a-drawer>
  </div>
</template>

<style>
.final-preview {
  position: absolute;
  width: calc(100% - 400px);
  height: 100%;
  background: transparent;
  top: 0;
  left: 0;
  z-index: 1500;
  display: flex;
  align-items: center;
  justify-content: center;
}
.final-preview-inner {
  width: 430px;
  height: 870px;
  padding: 60px 28px;
  position: relative;
  background: url('@/assets/phone-back.png') no-repeat;
  background-size: cover;
}

.final-preview-inner .preview-title {
  height: 44px;
  line-height: 44px;
  text-align: center;
  font-weight: bold;
}
.iframe-container {
  width: 100%;
  height: 706px;
  overflow-y: auto;
  overflow-x: hidden;
}
.iframe-placeholder
{
   background: url('~@/assets/loading.svg') 50% 50% no-repeat;
   background-size: 50px;
}
.publish-form-container .file-upload-container {
  height: 130px;
}
.publish-form-container .ant-form-item-label {
  text-align: left;
}
#preview-barcode-container {
  border: 2px dotted #efefef;
  padding: 10px;
}
</style>
