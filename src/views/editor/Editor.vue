<script lang="ts" setup>
import { useEditorStore } from '@/store/editor/editor'

const editorStore = useEditorStore()
</script>

<template>
  <div
    class="editor [&>*]:m-2 flex justify-between h-screen border-2 border-blue-400"
  >
    <div class="component-list w-60 border-2 border-yellow-400">
      <h1>component list</h1>
    </div>
    <div class="canvas flex-1 border-2 border-red-400">
      <h1>canvas</h1>
      <div v-for="(comp, index) in editorStore.$state.components" :key="index">
        {{ comp.props.text }}
      </div>
    </div>
    <div class="attr-panel w-60 border-2 border-green-400">attr panel</div>
  </div>
</template>
