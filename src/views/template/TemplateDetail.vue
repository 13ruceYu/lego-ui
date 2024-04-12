<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { createWorkByTemplate, getTemplateById } from '@/api/modules/works'
import type { Template } from '@/api/modules/works/types'

export default defineComponent({
  setup() {
    const route = useRoute()
    const router = useRouter()
    const currentId = ref<string | null>(route.params.id as string | null)
    const template = ref<Template | null>(null)

    const fetchTemplate = async () => {
      if (currentId.value) {
        const templateRes = await getTemplateById(currentId.value)
        template.value = templateRes
      }
    }

    async function useTemplate() {
      // use template
      // 1. copy current template data
      // 2. use template data create new work
      // 3. jump to editor page
      if (currentId.value) {
        const res = await createWorkByTemplate(currentId.value)
        const { id } = res
        router.push(`/editor/${id}`)
      }
    }

    onMounted(fetchTemplate)

    return {
      route,
      template,
      useTemplate,
    }
  },
})
</script>

<template>
  <div class="pt-8">
    <a-row v-if="template" type="flex" justify="center" :gutter="36">
      <a-col :span="8">
        <!-- <img :src="template.coverImg" alt=""> -->
        <img v-if="template.coverImg" :src="template.coverImg">
        <img v-else src="http://typescript-vue.oss-cn-beijing.aliyuncs.com/vue-marker/5f81cca3f3bf7a0e1ebaf885.png">
      </a-col>
      <a-col :span="8">
        <h2>{{ template.title }}</h2>
        <p>{{ template.desc }}</p>
        <div class="author">
          <a-avatar>V</a-avatar>
          该模版由 <b>{{ template.author }}</b> 创作
        </div>
        <div class="bar-code-area">
          <span>扫一扫，手机预览</span>
        </div>
        <div class="use-button">
          <a-button
            type="primary" size="large" @click="useTemplate"
          >
            使用模版
          </a-button>
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
