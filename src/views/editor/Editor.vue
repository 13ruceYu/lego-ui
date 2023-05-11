<script lang="ts" setup>
import { useEditorStore } from '@/store/editor/editor'
import LText from '@/components/LText.vue'
import ComponentsList from '@/components/ComponentsList.vue'
import { defaultTextTemplates } from '@/constants/defaultTemplates'

interface compMap {
  [key: string]: object
}

const editorStore = useEditorStore()
const localComps: compMap = { 'l-text': LText }

function addItem(props: any) {
  editorStore.addComponent(props)
}
</script>

<template>
  <div class="editor [&>*]:m-2 flex justify-between h-screen border-2 border-blue-400">
    <div class="component-list w-60 border-2 border-yellow-400">
      <ComponentsList :list="defaultTextTemplates" @on-item-click="addItem"></ComponentsList>
    </div>
    <div class="canvas flex-1 border-2 border-red-400">
      <h1>canvas</h1>
      <div class="frame w-80 h-96 bg-slate-200 m-auto relative">
        <component
          :is="localComps[comp.name]"
          v-for="(comp, index) in editorStore.$state.components"
          :key="index"
          v-bind="comp.props"
        >
          {{ comp.props.text }}
        </component>
      </div>
    </div>
    <div class="attr-panel w-60 border-2 border-green-400">attr panel</div>
  </div>
</template>
