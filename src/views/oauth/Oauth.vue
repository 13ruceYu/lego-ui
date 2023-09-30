<script lang="ts" setup>
import { onMounted } from 'vue'
import axios from 'axios'

function open() {
  window.open('http://localhost:7001/api/users/passport/github', '_blank', 'height=500,width=600')
}
onMounted(() => {
  window.addEventListener('message', (m) => {
    const { type, token } = m.data
    if (type === 'oauth-token') {
      axios.get('http://localhost:7001/api/users/getUserInfo', {
        headers: { Authorization: `Bearer ${token}` },
      }).then((data) => {
        // eslint-disable-next-line no-console
        console.log(data)
      })
    }
  })
})
</script>

<template>
  <a-button @click="open">
    使用 Github 登录
  </a-button>
</template>
