<script lang="ts">
import type { PropType } from 'vue'
import { defineComponent, onMounted, onUnmounted, ref } from 'vue'
import type { ActionItem } from './createContextMenu'
import { getParentElement } from '@/utils/helper'

export default defineComponent({
  props: {
    actions: {
      type: Array as PropType<ActionItem[]>,
      required: true,
    },
    triggerClass: {
      type: String,
      default: 'edit-wrapper',
    },
  },
  setup(props) {
    const menuRef = ref<HTMLElement | null>(null)
    const componentId = ref('')
    const triggerContextMenu = (e: MouseEvent) => {
      const domElement = menuRef.value as HTMLElement
      const wrapperElement = getParentElement(e.target as HTMLElement, props.triggerClass)
      if (wrapperElement) {
        e.preventDefault()
        domElement.style.display = 'block'
        domElement.style.top = `${e.pageY}px`
        domElement.style.left = `${e.pageX}px`
        const cid = wrapperElement.dataset.componentId
        if (cid)
          componentId.value = cid
      }
    }
    const handleClick = () => {
      const domElement = menuRef.value as HTMLElement
      domElement.style.display = 'none'
    }
    onMounted(() => {
      document.addEventListener('contextmenu', triggerContextMenu)
      document.addEventListener('click', handleClick)
    })

    onUnmounted(() => {
      document.removeEventListener('contextmenu', triggerContextMenu)
      document.removeEventListener('click', handleClick)
    })
    return {
      menuRef,
      componentId,
    }
  },
})
</script>

<template>
  <div ref="menuRef" class="context-menu-component menu-container">
    <ul class="ant-menu-light ant-menu-root ant-menu ant-menu-vertical">
      <li v-for="(action, index) in actions" :key="index" class="ant-menu-item" @click="action.action(componentId)">
        <span class="item-text">{{ action.text }}</span>
        <span class="item-shortcut">{{ action.shortcut }}</span>
      </li>
    </ul>
  </div>
</template>

<style>
.menu-container {
  display: none;
  position: absolute;
  background: #fff;
  z-index: 2000;
  width: 220px;
  border: 1px solid #ccc;
}
.menu-container .ant-menu-item {
  display: flex;
  justify-content: space-between;
}
.menu-container .ant-menu-item:hover {
  background: #efefef;
}
.ant-menu-item .item-shortcut {
  color: #ccc;
}
</style>
