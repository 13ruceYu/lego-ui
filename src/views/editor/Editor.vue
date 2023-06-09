<script lang="ts" setup>
import { computed } from 'vue'
import { useEditorStore } from '@/store/editor/editor'
import LText from '@/components/LText.vue'
import ComponentsList from '@/components/ComponentsList.vue'
import EditWrapper from '@/components/EditWrapper.vue'
import PropsTable from '@/components/PropsTable.vue'
import { defaultTextTemplates } from '@/constants/defaultTemplates'

interface compMap {
  [key: string]: object
}

const editorStore = useEditorStore()
const localComps: compMap = { 'l-text': LText }
const currentElement = computed(() => editorStore.getCurrentElement)

function addItem(props: any) {
  editorStore.addComponent(props)
}

function setActive(id: string) {
  editorStore.setActive(id)
}

function handleChange(e: any) {
  const { key, value } = e
  editorStore.updateComponent(key, value)
}

function removeCurrentElement() {
  currentElement.value && editorStore.removeComponent(currentElement.value.id)
}
</script>

<template>
  <div class="editor [&>*]:m-2 flex justify-between h-screen border-2 border-blue-400">
    <div class="component-list w-60 border-2 border-yellow-400">
      <h1>组件列表</h1>
      <ComponentsList :list="defaultTextTemplates" @on-item-click="addItem"></ComponentsList>
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
      <h1>组件属性</h1>
      <PropsTable
        v-if="currentElement && currentElement.props"
        :props="currentElement.props"
        @change="handleChange"
      ></PropsTable>
      <pre>
        {{ currentElement?.props }}
      </pre>
      <a-button v-show="currentElement" type="danger" size="small" @click="removeCurrentElement">删除</a-button>
    </div>
  </div>
</template>
