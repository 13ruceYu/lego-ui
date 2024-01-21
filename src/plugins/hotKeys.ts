import { computed } from 'vue'
import { useHotKeys } from '@/hooks/useHotKeys'
import { useEditorStore } from '@/store/editor/editor'

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
