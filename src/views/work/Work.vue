<script setup lang="ts">
import { onMounted, reactive } from 'vue'
import { getMyWorkList } from '@/api/modules/works'
import type { MyWorkListRes } from '@/api/modules/works/types'

const state = reactive<{ myWorkList: MyWorkListRes | null }>({
  myWorkList: null,
})

async function createEmptyWork() {

}

onMounted(async () => {
  state.myWorkList = await getMyWorkList()
})
</script>

<template>
  <h1>我的作品</h1>
  <a-button @click="createEmptyWork">
    创建作品
  </a-button>
  <div v-if="state.myWorkList">
    <router-link v-for="(work, idx) in state.myWorkList.list" :key="idx" :to="`/editor/${work.id}`" class="block">
      {{ work.title }}
    </router-link>
  </div>
</template>
