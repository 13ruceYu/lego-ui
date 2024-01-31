import { onMounted, onUnmounted, ref } from 'vue'
import { onBeforeRouteLeave, useRoute } from 'vue-router'
import { Modal } from 'ant-design-vue'
import { updateMyWork } from '@/api/modules/works'
import { useEditorStore } from '@/store/editor/editor'

export function useSaveWork() {
  const saveLoading = ref(false)
  let timer: ReturnType<typeof setInterval>
  const editorStore = useEditorStore()
  const route = useRoute()
  const workId = route.params.id as string

  async function saveWork() {
    saveLoading.value = true
    const { page, components } = editorStore
    await updateMyWork(workId, {
      title: page.title,
      desc: page.desc,
      content: {
        components,
        props: page.props,
      },
    })
    saveLoading.value = false
    editorStore.isDirty = false
  }

  onMounted(async () => {
    timer = setInterval(() => {
      if (editorStore.isDirty)
        saveWork()
    }, 1000 * 5)
  })
  onUnmounted(() => {
    clearInterval(timer)
  })
  onBeforeRouteLeave((to, from, next) => {
    if (editorStore.isDirty) {
      Modal.confirm({
        title: '作品还未保存，是否保存？',
        okText: '保存',
        okType: 'primary',
        cancelText: '不保存',
        onOk: async () => {
          await saveWork()
          next()
        },
        onCancel() {
          next()
        },
      })
    }
    else {
      next()
    }
  })

  return { saveLoading, saveWork }
}
