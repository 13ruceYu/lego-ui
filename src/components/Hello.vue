<script lang="ts" setup>
const props = defineProps({
  name: {
    type: String,
    default: '',
  },
})
</script>

<template>
  <h1>hello {{ props.name }}</h1>
</template>
