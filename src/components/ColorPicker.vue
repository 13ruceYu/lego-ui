<script lang="ts" setup>
import type { PropType } from 'vue'
import { defaultColors } from '@/constants/defaultColors'

const props = defineProps({
  value: {
    type: String,
  },
  colors: {
    type: Array as PropType<string[]>,
    default: defaultColors,
  },
})

const emits = defineEmits(['change'])

function onChange(color: string) {
  emits('change', color)
}
</script>

<template>
  <div class="color-picker">
    <div class="native-color-container">
      <input type="color" :value="value" @input="onChange(($event.target as HTMLInputElement).value)">
    </div>
    <ul class="picked-color-list">
      <li v-for="(item, key) in colors" :key="key" :class="`item-${key}`" @click.prevent="onChange(item)">
        <div v-if="item.startsWith('#')" :style="{ 'background-color': item }" class="color-item" />
        <div v-else class="transparent-back color-item" />
      </li>
    </ul>
  </div>
</template>
