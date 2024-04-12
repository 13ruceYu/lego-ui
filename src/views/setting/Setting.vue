<script lang="ts" setup>
import { useUserStore } from '@/store/user/user'

const user = useUserStore()
</script>

<template>
  <div class="w-[400px] m-auto pt-10">
    <a-form>
      <a-form-item label="username" name="username">
        <a-input :value="user.data.username" />
      </a-form-item>
      <a-form-item label="nickName" name="nickName">
        <a-input :value="user.data.nickName" />
      </a-form-item>
      <a-form-item label="phoneNumber" name="phoneNumber">
        <a-input :value="user.data.phoneNumber" />
      </a-form-item>
      <a-form-item label="email" name="email">
        <a-input :value="user.data.email" />
      </a-form-item>
    </a-form>
  </div>
</template>
