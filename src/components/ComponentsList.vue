<script lang="ts" setup>
import LText from './LText.vue'

const props = defineProps({
  list: {
    type: Array,
    required: true,
    default: () => [],
  },
})

const emits = defineEmits(['onItemClick'])

function onClick(data: any) {
  emits('onItemClick', data)
}
</script>

<template>
  <div class="create-component-list">
    <div v-for="(item, index) in props.list" :key="index" class="component-item" @click="onClick(item)">
      <LText v-bind="item" />
    </div>
  </div>
</template>
