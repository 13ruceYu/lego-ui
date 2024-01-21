import { computed } from 'vue'
import type { HotkeysEvent, KeyHandler } from 'hotkeys-js'
import { useHotKeys } from '@/hooks/useHotKeys'
import { useEditorStore } from '@/store/editor/editor'

// hof(higher-order-function) to browser default event when use hotkey
function _wrapper(cb: KeyHandler) {
  return (e: KeyboardEvent, event: HotkeysEvent) => {
    e.preventDefault()
    cb(e, event)
  }
}

export function initHotKeys() {
  const editorStore = useEditorStore()
  const curId = computed(() => editorStore.currentElement)
  useHotKeys('ctrl+c, command+c', () => {
    editorStore.copyComponent(curId.value)
  })
  useHotKeys('ctrl+v, command+v', () => {
    editorStore.pasteCopiedComponent()
  })
  useHotKeys('delete, backspace', () => {
    editorStore.deleteComponent(curId.value)
  })
  useHotKeys('esc', () => {
    editorStore.setActive('')
  })
  useHotKeys('up', () => {
    editorStore.moveComponent({ direction: 'Up', amount: 1, id: curId.value })
  })
}
