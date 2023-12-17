<script lang="ts" setup>
import type { Ref } from 'vue'
import { nextTick, ref, watch } from 'vue'
import { useKeyPress } from '@/hooks/useKeyPress'
import { useClickOutside } from '@/hooks/useClickOutside'

const props = defineProps({
  value: { type: String, required: true },
})
const emits = defineEmits(['change'])
const innerValue = ref(props.value)
const isEditing = ref(false)
const wrapperRef = ref<null | HTMLElement>(null)
const inputRef = ref<null | HTMLInputElement>(null)
const isClickOutSide = useClickOutside(wrapperRef as Ref)
let cachedValue = ''

watch(isEditing, async (newVal) => {
  if (newVal) {
    cachedValue = innerValue.value
    await nextTick()
    inputRef.value?.focus()
  }
})

watch(isClickOutSide, (newVal) => {
  if (newVal && isEditing.value) {
    isEditing.value = false
    emits('change', innerValue.value)
  }
  // TODO: optimize useClickOutside
  isClickOutSide.value = false
})

function handleClick() {
  isEditing.value = true
}

useKeyPress('Enter', () => {
  if (isEditing.value) {
    isEditing.value = false
    emits('change', innerValue.value)
  }
})

useKeyPress('Escape', () => {
  if (isEditing.value) {
    isEditing.value = false
    innerValue.value = cachedValue
  }
})
</script>

<template>
  <div ref="wrapperRef" class="inline-edit" @click.stop="handleClick">
    <input v-if="isEditing" ref="inputRef" v-model="innerValue" class="border border-red-500">
    <slot v-else>
      <span>{{ innerValue }}</span>
    </slot>
  </div>
</template>
