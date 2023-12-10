<script lang="ts" setup>
import { computed, ref } from 'vue'
import { useEditorStore } from '@/store/editor/editor'
import LText from '@/components/LText.vue'
import LImage from '@/components/LImage.vue'
import ComponentsList from '@/components/ComponentsList.vue'
import EditWrapper from '@/components/EditWrapper.vue'
import PropsTable from '@/components/PropsTable.vue'
import LayerList from '@/components/LayerList.vue'
import { defaultTextTemplates } from '@/constants/defaultTemplates'

interface compMap {
  [key: string]: object
}

const localComps: compMap = { 'l-text': LText, 'l-image': LImage }

const editorStore = useEditorStore()
const currentElement = computed(() => editorStore.getCurrentElement)
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

function removeCurrentElement() {
  currentElement.value && editorStore.removeComponent(currentElement.value.id)
}
</script>

<template>
  <div class="editor [&>*]:m-2 flex justify-between h-screen border-2 border-blue-400">
    <div class="component-list w-60 border-2 border-yellow-400">
      <h1>组件列表</h1>
      <ComponentsList :list="defaultTextTemplates" @on-item-click="addItem" />
    </div>
    <div class="canvas flex-1 border-2 border-red-400">
      <h1>画布</h1>
      <div class="frame w-80 h-96 bg-slate-200 m-auto relative">
        <EditWrapper
          v-for="(comp, index) in editorStore.$state.components"
          :key="index"
          :active="comp.id === currentElement?.id"
          @set-active="setActive(comp.id)"
        >
          <component :is="localComps[comp.name]" v-bind="comp.props">
            {{ comp.props.text }}
          </component>
        </EditWrapper>
      </div>
    </div>
    <div class="attr-panel w-60 border-2 border-green-400">
      <a-tabs v-model:activeKey="activeKey">
        <a-tab-pane key="1" tab="属性设置">
          <a-empty v-if="currentElement?.isLocked" />
          <div v-else>
            <PropsTable
              v-if="currentElement && currentElement.props"
              :props="currentElement.props"
              @change="handleChange"
            />
            <pre>
              {{ currentElement?.props }}
            </pre>
            <a-button v-show="currentElement" danger size="small" @click="removeCurrentElement">
              删除
            </a-button>
          </div>
        </a-tab-pane>
        <a-tab-pane key="2" tab="图层设置" force-render>
          <LayerList :list="editorStore.components" :selected-id="currentElement?.id" @change="handleChange" @select="setActive" />
        </a-tab-pane>
      </a-tabs>
    </div>
  </div>
</template>
