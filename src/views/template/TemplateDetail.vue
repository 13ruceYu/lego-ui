<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { getTemplateById } from '@/api/modules/works'
import type { Template } from '@/api/modules/works/types'

export default defineComponent({
  setup() {
    const route = useRoute()
    const currentId = ref<string | null>(route.params.id as string | null)
    const template = ref<Template | null>(null)

    const fetchTemplate = async () => {
      if (currentId.value) {
        const templateRes = await getTemplateById(currentId.value)
        template.value = templateRes
      }
    }

    onMounted(fetchTemplate)

    return {
      route,
      template,
    }
  },
})
</script>

<template>
  <div class="work-detail-container">
    <a-row v-if="template" type="flex" justify="center">
      <a-col :span="8" class="cover-img">
        <img :src="template.coverImg" alt="">
      </a-col>
      <a-col :span="8">
        <h2>{{ template.title }}</h2>
        <p>{{ template.title }}</p>
        <div class="author">
          <a-avatar>V</a-avatar>
          该模版由 <b>{{ template.author }}</b> 创作
        </div>
        <div class="bar-code-area">
          <span>扫一扫，手机预览</span>
          <div />
        </div>
        <div class="use-button">
          <router-link to="/editor">
            <a-button
              type="primary" size="large"
            >
              使用模版
            </a-button>
          </router-link>
          <a-button
            size="large"
          >
            下载图片海报
          </a-button>
        </div>
      </a-col>
    </a-row>
  </div>
</template>

<style scoped>
.work-detail-container {
  margin-top:50px;
}
.cover-img {
  margin-right: 30px;
}
.cover-img img {
  width: 100%;
}
.use-button {
  margin: 30px 0;
}
.ant-avatar {
  margin-right: 10px;
}
.bar-code-area {
  margin: 20px 0;
}
</style>
