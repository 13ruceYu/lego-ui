<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from './store/user/user'

const userStore = useUserStore()
const router = useRouter()

onMounted(() => {
  window.addEventListener('message', (message) => {
    const { token } = message.data
    if (token) {
      userStore.loginByOauth(token)
      router.push('/')
    }
  })
})
</script>

<template>
  <router-view />
</template>
