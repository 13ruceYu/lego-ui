<script lang="ts">
import type { PropType } from 'vue'
import { defineComponent } from 'vue'
import type { TemplateProps } from '@/store/template/template'

export default defineComponent({
  name: 'TemplateList',
  props: {
    list: {
      type: Array as PropType<TemplateProps[]>,
      required: true,
    },
  },
})
</script>

<template>
  <div class="template-list-component">
    <a-row :gutter="16">
      <a-col v-for="item in list" :key="item.id" :span="6" class="poster-item">
        <router-link :to="{ name: 'template', params: { id: item.id } }">
          <a-card hoverable>
            <template #cover>
              <div class="group h-[360px] overflow-hidden">
                <img v-if="item.coverImg" :src="item.coverImg">
                <img v-else src="http://typescript-vue.oss-cn-beijing.aliyuncs.com/vue-marker/5f81cca3f3bf7a0e1ebaf885.png">
                <div class="absolute hidden group-hover:flex bg-black/50 left-0 top-0 w-[100%] h-[100%] items-center justify-center">
                  <a-button size="large" type="primary">
                    使用该模版创建
                  </a-button>
                </div>
              </div>
            </template>
            <a-card-meta :title="item.title">
              <template #description>
                <div class="description-detail">
                  <span>作者：{{ item.author }}</span>
                  <span class="user-number">{{ item.copiedCount }}</span>
                </div>
              </template>
            </a-card-meta>
          </a-card>
        </router-link>
      </a-col>
    </a-row>
  </div>
</template>
