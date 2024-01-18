<script setup lang="ts">
import { onMounted } from 'vue'
import { axios } from '@/api/axios'
import { useUserStore } from '@/store/user/user'

onMounted(() => {
  const userStore = useUserStore()
  const token = localStorage.getItem('token')
  if (token) {
    axios.defaults.headers.common.Authorization = `Bearer ${token}`
    userStore.fetchCurrentUser().catch(() => {
      localStorage.removeItem('token')
      delete axios.defaults.headers.common.Authorization
    })
  }
})
</script>

<template>
  <router-view />
</template>
