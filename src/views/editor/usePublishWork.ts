import { ref } from 'vue'
import { useRoute } from 'vue-router'
import { useSaveWork } from './useSaveWork'
import { createChannel, getWorkChannel } from '@/api/modules/channel'
import { publishWork } from '@/api/modules/works'
import { useEditorStore } from '@/store/editor/editor'
import { takeScreenshotAndUpload } from '@/utils/helper'

export function usePublishWork() {
  const publishLoading = ref(false)
  const editorStore = useEditorStore()
  const workId = useRoute().params.id as string
  const { saveWork } = useSaveWork(false)

  async function publish(el: HTMLElement) {
    publishLoading.value = true
    try {
      // take screenshot and upload
      const data = await takeScreenshotAndUpload(el)
      if (data) {
        // update page coverImg in store
        editorStore.updatePage({ key: 'coverImg', value: data[0], isRoot: true })
        // save work
        await saveWork()
        // publish work
        await publishWork(workId)
        // get channel list
        const channels = await getWorkChannel(workId)
        if (channels.list.length === 0)
          await createChannel({ name: '默认', workId: parseInt(workId) })
      }
    }
    catch (error) {

    }
    publishLoading.value = false
  }

  return { publish, publishLoading }
}
