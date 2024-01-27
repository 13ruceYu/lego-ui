<script lang="ts" setup>
import { pickBy } from 'lodash'
import { computed, ref } from 'vue'
import HistoryArea from './HistoryArea.vue'
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

interface compMap {
  [key: string]: object
}
initHotKeys()
const localComps: compMap = { 'l-text': LText, 'l-image': LImage }
const editorStore = useEditorStore()
const currentElement = computed(() => editorStore.getCurrentElement)
const page = computed(() => editorStore.page)
const activeKey = ref('1')

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
  <div class="editor [&>*]:m-2 flex justify-between h-screen border-2 border-blue-400">
    <div class="border-2 border-yellow-400 component-list w-60">
      <h1>组件列表</h1>
      <ComponentsList :list="defaultTextTemplates" @on-item-click="addItem" />
    </div>
    <!-- TODO: when canvas position relative, item move position error -->
    <div class="flex-1 border-2 border-red-400 canvas relative">
      <h1>画布</h1>
      <HistoryArea />
      <div id="canvas-area" class="relative m-auto frame w-80 h-96 bg-slate-200" :style="page.props">
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
          <PropsTable :props="page.props" @change="pageChange" />
        </a-tab-pane>
      </a-tabs>
    </div>
  </div>
</template>
