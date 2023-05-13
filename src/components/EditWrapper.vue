<script lang="ts" setup>
const props = defineProps({
  id: {
    type: String,
    default: ''
  },
  active: {
    type: Boolean,
    default: false
  }
})

const emits = defineEmits(['setActive'])

function onItemClick(id: string) {
  emits('setActive', id)
}
</script>

<template>
  <div class="edit-wrapper" :class="[active && 'outline outline-1 outline-pink-500']" @click="onItemClick(props.id)">
    <slot></slot>
  </div>
</template>

<style scoped>
.edit-wrapper:hover {
  outline: 1px dashed cyan;
}
</style>
