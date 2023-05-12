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
  <div class="edit-wrapper" :class="[active && 'active']" @click="onItemClick(props.id)">
    <slot></slot>
  </div>
</template>

<style scoped>
.active {
  border: 1px solid pink;
}
</style>
