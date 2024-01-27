import { onMounted, onUnmounted } from 'vue'
import type { ActionItem } from '../components/createContextMenu'
import createContextMenu from '../components/createContextMenu'
import { useEditorStore } from '@/store/editor/editor'

function initContextMenu() {
  const store = useEditorStore()
  const testActions: ActionItem[] = [
    {
      shortcut: 'Backspace / Delete',
      text: '删除图层',
      action: (cid) => {
        cid && store.deleteComponent(cid)
      },
    },
  ]

  // const testActions2: ActionItem[] = [
  //   { shortcut: 'Ctrl+C', text: '复制配置', action: () => { console.log(2) } },
  // ]
  let destroy: any
  onMounted(() => {
    destroy = createContextMenu(testActions)
    // destroy2 = createContextMenu(testActions2, 'settings-panel')
  })
  onUnmounted(() => {
    destroy()
    // destroy2()
  })
}

export { initContextMenu }
