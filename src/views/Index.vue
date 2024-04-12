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
      <a-layout-header class="flex justify-between">
        <div class="page-title">
          <router-link to="/" class="font-bold text-lg">
            MOCK-LEGO
          </router-link>
        </div>
        <UserProfile />
      </a-layout-header>
      <a-layout-content>
        <router-view />
      </a-layout-content>
    </a-layout>
    <a-layout-footer>
      Footer
    </a-layout-footer>
  </div>
</template>
