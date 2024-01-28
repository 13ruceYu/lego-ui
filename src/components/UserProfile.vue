<script lang="ts">
import { defineComponent } from 'vue'
import { useRouter } from 'vue-router'
import { message } from 'ant-design-vue'
import { useUserStore } from '@/store/user/user'

export default defineComponent({
  name: 'UserProfile',
  setup() {
    const userStore = useUserStore()
    const router = useRouter()
    const logout = () => {
      message.success('退出登录成功，2秒后跳转到首页', 2)
      userStore.logout()
      setTimeout(() => {
        router.push('/login')
      }, 2000)
    }
    return {
      logout,
      userStore,
      router,
    }
  },
})
</script>

<template>
  <a-button
    v-if="!userStore.isLogin" type="primary"
    class="btn-login"
    @click="router.push('/login')"
  >
    登录
  </a-button>
  <div v-else>
    <a-dropdown-button class="user-profile-component">
      <router-link to="/setting">
        {{ userStore.data.username }}
      </router-link>
      <template #overlay>
        <a-menu class="user-profile-dropdown">
          <a-menu-item key="0" @click="logout">
            登出
          </a-menu-item>
        </a-menu>
      </template>
    </a-dropdown-button>
  </div>
</template>

<style>
.user-profile-dropdown {
  border-radius: 2px !important;
}
.user-operation > * {
  margin-left: 30px !important;
}
</style>
