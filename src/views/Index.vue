<script lang="ts">
import { defineComponent } from 'vue'
import UserProfile from '../components/UserProfile.vue'

export default defineComponent({
  name: 'Index',
  components: {
    UserProfile,
  },
})
</script>

<template>
  <div class="homepage-container">
    <a-layout :style="{ background: '#fff' }">
      <a-layout-header class="header">
        <div class="page-title">
          <router-link to="/">
            Home
          </router-link>
        </div>
        <UserProfile />
      </a-layout-header>
      <a-layout-content class="home-layout">
        <router-view />
      </a-layout-content>
    </a-layout>
    <a-layout-footer>
      Footer
    </a-layout-footer>
  </div>
</template>

<style>
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.page-title {
  color: #fff;
}
</style>
