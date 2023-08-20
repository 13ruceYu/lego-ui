<script lang="ts" setup>
import Hello from '@/components/Hello'
import Uploader from '@/components/Uploader.vue'
</script>

<template>
  <nav class="flex justify-between bg-slate-400 h-10 items-center px-3">
    <div class="logo">
      lego-logo
    </div>
    <div class="user-info">
      user-1
    </div>
  </nav>
  <Hello name="hello" />
  <Uploader action="" drag />
</template>
