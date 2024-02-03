<script lang="ts" setup>
import { pickBy } from 'lodash'
import { computed, nextTick, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import html2canvas from 'html2canvas'
import HistoryArea from './HistoryArea.vue'
import { useSaveWork } from './useSaveWork'
import { useEditorStore } from '@/store/editor/editor'
import LText from '@/components/LText.vue'
import LImage from '@/components/LImage.vue'
import ComponentsList from '@/components/ComponentsList.vue'
import EditWrapper from '@/components/EditWrapper.vue'
import EditGroup from '@/components/EditGroup.vue'
import LayerList from '@/components/LayerList.vue'
import PropsTable from '@/components/PropsTable.vue'
import { defaultTextTemplates } from '@/constants/defaultTemplates'
import { initHotKeys } from '@/plugins/hotKeys'
import { initContextMenu } from '@/plugins/contextMenu'
import { getMyWork } from '@/api/modules/works'

interface compMap {
  [key: string]: object
}

initHotKeys()
initContextMenu()

const localComps: compMap = { 'l-text': LText, 'l-image': LImage }
const editorStore = useEditorStore()
const currentElement = computed(() => editorStore.getCurrentElement)
const page = computed(() => editorStore.page)
const activeKey = ref('1')
const route = useRoute()
const workId = route.params.id as string
const { saveLoading, saveWork } = useSaveWork()
const canvasFix = ref(false)

onMounted(async () => {
  const res = await getMyWork(workId)
  const { content, ...rest } = res
  editorStore.page = { ...editorStore.page, ...rest }
  if (content.props)
    editorStore.page.props = content.props

  editorStore.components = content.components
})

async function publish() {
  editorStore.setActive('')
  const el = document.getElementById('canvas-area') as HTMLElement
  canvasFix.value = true
  await nextTick()
  html2canvas(el, { width: 375, useCORS: true, scale: 1 }).then((canvas) => {
    const image = document.getElementById('test-image') as HTMLImageElement
    image.src = canvas.toDataURL()
    canvasFix.value = false
  })
}

function addItem(props: any) {
  editorStore.addComponent(props)
}

function setActive(id: string) {
  editorStore.setActive(id)
}

function handleChange(e: any) {
  editorStore.updateComponent(e)
}

function pageChange(e: any) {
  editorStore.updatePage(e)
}

function removeCurrentElement() {
  currentElement.value && editorStore.deleteComponent(currentElement.value.id)
}

function updatePosition(data: { left: number; top: number; id: string }) {
  const { id } = data
  const updatedData = pickBy<number>(data, (v, k) => k !== 'id')
  const keysArr = Object.keys(updatedData)
  const valuesArr = Object.values(updatedData).map(v => `${v}px`)
  editorStore.updateComponent({ id, key: keysArr, value: valuesArr })
}
</script>

<template>
  <header class="border-2 border-orange-300 bg-slate-300 h-12 flex items-center justify-between px-4">
    <div>
      <router-link to="/">
        Home
      </router-link>{{ page.title }}
    </div>
    <div>
      <a-button @click="publish">
        发布
      </a-button>
      <a-button :loading="saveLoading" @click="saveWork">
        保存
      </a-button>
    </div>
  </header>
  <div class="editor [&>*]:m-2 flex justify-between h-[calc(100vh-3rem)] border-2 border-blue-400">
    <div class="border-2 border-yellow-400 component-list w-60">
      <h1>组件列表</h1>
      <ComponentsList :list="defaultTextTemplates" @on-item-click="addItem" />
      <img id="test-image" style="width: 300px;">
    </div>
    <div class="relative flex-1 border-2 border-red-400 canvas">
      <h1>画布</h1>
      <HistoryArea />
      <div id="canvas-area" :class="{ 'canvas-fix': canvasFix }" class="relative m-auto frame w-[360px] h-[600px] bg-slate-200 border border-pink-800" :style="page.props">
        <EditWrapper
          v-for="(comp, index) in editorStore.components"
          :id="comp.id"
          :key="index"
          :active="comp.id === currentElement?.id"
          :props="comp.props"
          @set-active="setActive(comp.id)"
          @update-position="updatePosition"
        >
          <component :is="localComps[comp.name]" v-bind="comp.props" style="position: static !important; width: 100% !important; height: 100% !important;">
            {{ comp.props.text }}
          </component>
        </EditWrapper>
      </div>
    </div>
    <div class="overflow-auto border-2 border-green-400 attr-panel w-60">
      <a-tabs v-model:activeKey="activeKey">
        <a-tab-pane key="1" tab="属性设置">
          <a-empty v-if="currentElement?.isLocked" />
          <div v-else class="overflow-auto">
            <EditGroup
              v-if="currentElement && currentElement.props"
              :props="currentElement.props"
              @change="handleChange"
            />
            <a-button v-show="currentElement" danger size="small" @click="removeCurrentElement">
              删除
            </a-button>
          </div>
        </a-tab-pane>
        <a-tab-pane key="2" tab="图层设置" force-render>
          <LayerList :list="editorStore.components" :selected-id="currentElement?.id" @change="handleChange" @select="setActive" />
        </a-tab-pane>
        <a-tab-pane key="3" tab="页面设置" force-render>
          <PropsTable :props="page.props || {}" @change="pageChange" />
        </a-tab-pane>
      </a-tabs>
    </div>
  </div>
</template>

<style scoped>
.canvas-fix .edit-wrapper > * {
  box-shadow: none !important;
}
</style>
