<script lang="ts" setup>
import { pick } from 'lodash'
import { computed, ref } from 'vue'

const props = defineProps({
  id: {
    type: String,
    default: '',
  },
  active: {
    type: Boolean,
    default: false,
  },
  props: {
    type: Object,
    default: () => ({}),
  },
})

const emits = defineEmits(['setActive', 'updatePosition'])

const wrapperEl = ref<null | HTMLElement>()
const styleFromChild = computed(() => pick(props.props, ['height', 'width', 'top', 'left', 'position']))

const gap = {
  x: 0,
  y: 0,
}

let isMoved = false

function calcMovePosition(e: MouseEvent) {
  const elContainer = document.getElementById('canvas-area') as HTMLElement
  const left = e.clientX - gap.x - elContainer.offsetLeft
  const top = e.clientY - gap.y - elContainer.offsetTop
  return { left, top }
}

function startMove(e: MouseEvent) {
  const curEl = wrapperEl.value
  if (curEl) {
    const { left, top } = curEl.getBoundingClientRect()
    gap.x = e.clientX - left
    gap.y = e.clientY - top
  }
  function handleMove(e: MouseEvent) {
    isMoved = true
    const { left, top } = calcMovePosition(e)
    if (curEl) {
      curEl.style.top = `${top}px`
      curEl.style.left = `${left}px`
    }
  }
  function handleMouseUp(e: MouseEvent) {
    if (isMoved) {
      const { left, top } = calcMovePosition(e)
      emits('updatePosition', { id: props.id, left, top })
      isMoved = false
    }
    document.removeEventListener('mousemove', handleMove)
  }

  document.addEventListener('mousemove', handleMove)
  document.addEventListener('mouseup', handleMouseUp)
}

function onItemClick(id: string) {
  emits('setActive', id)
}
</script>

<template>
  <div
    ref="wrapperEl"
    class="edit-wrapper"
    :class="[active && 'outline outline-dash outline-1 outline-cyan-300']"
    :style="styleFromChild" @click="onItemClick(props.id)"
    @mousedown="startMove"
  >
    <slot />
  </div>
</template>

<style scoped>
.edit-wrapper:hover {
  outline: 1px dashed cyan;
}
</style>
