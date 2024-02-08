<script setup lang="ts">
import { onMounted, reactive } from 'vue'
import { getMyWorkList } from '@/api/modules/works'
import type { MyWorkListRes } from '@/api/modules/works/types'

const state = reactive<{ myWorkList: MyWorkListRes | null }>({
  myWorkList: null,
})

onMounted(async () => {
  state.myWorkList = await getMyWorkList()
})
</script>

<template>
  <h1>我的作品</h1>
  <div v-if="state.myWorkList">
    <router-link v-for="(work, idx) in state.myWorkList.list" :key="idx" :to="`/editor/${work.id}`" class="block">
      {{ work.title }}
    </router-link>
  </div>
</template>
