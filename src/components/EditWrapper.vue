<script lang="ts" setup>
import { pick } from 'lodash'
import { computed, nextTick, ref } from 'vue'

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

type ResizeDirection = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'
interface OriginalPositions {
  left: number
  right: number
  top: number
  bottom: number
}
interface Coordinate {
  x: number
  y: number
}

const wrapperEl = ref<null | HTMLElement>()
const styleFromChild = computed(() => pick(props.props, ['height', 'width', 'top', 'left', 'position']))

let isMoved = false

function calcMovePosition(e: MouseEvent, startTargetPosition: Coordinate, startMousePosition: Coordinate) {
  const mouseOffsetX = e.clientX - startMousePosition.x
  const mouseOffsetY = e.clientY - startMousePosition.y
  const left = startTargetPosition.x + mouseOffsetX
  const top = startTargetPosition.y + mouseOffsetY
  return { left, top }
}

function startMove(e: MouseEvent) {
  const curEl = wrapperEl.value
  const startMousePosition = { x: e.clientX, y: e.clientY }
  const startTargetPosition = { x: curEl?.offsetLeft || 0, y: curEl?.offsetTop || 0 }
  function handleMove(e: MouseEvent) {
    isMoved = true
    if (curEl) {
      const { left, top } = calcMovePosition(e, startTargetPosition, startMousePosition)
      curEl.style.top = `${top}px`
      curEl.style.left = `${left}px`
    }
  }
  function handleMouseUp(e: MouseEvent) {
    if (isMoved && curEl) {
      const { left, top } = calcMovePosition(e, startTargetPosition, startMousePosition)
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

function calculateSize(direction: ResizeDirection, e: MouseEvent, positions: OriginalPositions) {
  const { clientX, clientY } = e
  const { left, right, top, bottom } = positions
  const container = document.getElementById('canvas-area') as HTMLElement
  const rightWidth = clientX - left
  const leftWidth = right - clientX
  const bottomHeight = clientY - top
  const topHeight = bottom - clientY
  const topOffset = clientY - container.offsetTop + container.scrollTop
  const leftOffset = clientX - container.offsetLeft
  switch (direction) {
    case 'top-left':
      return {
        width: leftWidth,
        height: topHeight,
        top: topOffset,
        left: leftOffset,
      }
    case 'top-right':
      return {
        width: rightWidth,
        height: topHeight,
        top: topOffset,
      }
    case 'bottom-left':
      return {
        width: leftWidth,
        height: bottomHeight,
        left: leftOffset,
      }
    case 'bottom-right':
      return {
        width: rightWidth,
        height: bottomHeight,
      }
    default:
      break
  }
}

function startResize(direction: ResizeDirection) {
  const currentElement = wrapperEl.value as HTMLElement
  const { left, right, top, bottom } = currentElement.getBoundingClientRect()
  const handleMove = (e: MouseEvent) => {
    const size = calculateSize(direction, e, { left, right, top, bottom })
    const { style } = currentElement
    if (size) {
      style.width = `${size.width}px`
      style.height = `${size.height}px`
      if (size.left)
        style.left = `${size.left}px`

      if (size.top)
        style.top = `${size.top}px`
    }
  }
  const handleMouseUp = (e: MouseEvent) => {
    document.removeEventListener('mousemove', handleMove)
    const size = calculateSize(direction, e, { left, right, top, bottom })
    emits('updatePosition', { ...size, id: props.id })
    nextTick(() => {
      document.removeEventListener('mouseup', handleMouseUp)
    })
  }
  document.addEventListener('mousemove', handleMove)
  document.addEventListener('mouseup', handleMouseUp)
}
</script>

<template>
  <div
    ref="wrapperEl"
    class="edit-wrapper"
    :data-component-id="id"
    :class="[active && 'active outline outline-dash outline-1 outline-cyan-300']"
    :style="styleFromChild" @click="onItemClick(props.id)"
    @mousedown="startMove"
  >
    <slot />
    <div class="resizer-group">
      <div class="resizer top-left" @mousedown.stop="startResize('top-left')" />
      <div class="resizer top-right" @mousedown.stop="startResize('top-right')" />
      <div class="resizer bottom-left" @mousedown.stop="startResize('bottom-left')" />
      <div class="resizer bottom-right" @mousedown.stop="startResize('bottom-right')" />
    </div>
  </div>
</template>

<style scoped>
.edit-wrapper:hover {
  outline: 1px dashed cyan;
}
.edit-wrapper.active .resizer-group .resizer {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #fff;
  border: 3px solid #1890ff;
  position: absolute;
}
.edit-wrapper .resizer-group .resizer.top-left {
  left: -5px;
  top: -5px;
  cursor: nwse-resize;
}
.edit-wrapper .resizer-group .resizer.top-right {
  right: -5px;
  top: -5px;
  cursor: nesw-resize;
}
.edit-wrapper .resizer-group .resizer.bottom-left {
  left: -5px;
  bottom: -5px;
  cursor: nesw-resize;
}
.edit-wrapper .resizer-group .resizer.bottom-right {
  right: -5px;
  bottom: -5px;
  cursor: nwse-resize;
}
</style>
