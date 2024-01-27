<script lang="ts">
import { computed, defineComponent } from 'vue'
import { RedoOutlined, UndoOutlined } from '@ant-design/icons-vue'
import { useEditorStore } from '@/store/editor/editor'

export default defineComponent({
  components: {
    RedoOutlined,
    UndoOutlined,
  },
  setup() {
    const store = useEditorStore()
    const histories = computed(() => store.histories)
    const historyIndex = computed(() => store.historyIndex)
    const undoIsDisabled = computed<boolean>(() => store.checkUndoDisable)
    const redoIsDisabled = computed<boolean>(() => store.checkRedoDisable)

    const undoHistory = () => {
      store.undo()
    }
    const redoHistory = () => {
      store.redo()
    }
    return {
      histories,
      undoHistory,
      redoHistory,
      historyIndex,
      undoIsDisabled,
      redoIsDisabled,
    }
  },
})
</script>

<template>
  <div class="history-area">
    <div class="operation-list">
      <a-tooltip>
        <template #title>
          撤销
        </template>
        <a-button shape="circle" :disabled="undoIsDisabled" @click="undoHistory">
          <template #icon>
            <UndoOutlined />
          </template>
        </a-button>
      </a-tooltip>
      <a-tooltip>
        <template #title>
          重做
        </template>
        <a-button shape="circle" :disabled="redoIsDisabled" @click="redoHistory">
          <template #icon>
            <RedoOutlined />
          </template>
        </a-button>
      </a-tooltip>
    </div>
    <li v-for="(item, index) in histories" :key="item.id">
      <span :class="{ bold: index === historyIndex }">{{ item.type }} - {{ item.data.key }}</span>
    </li>
  </div>
</template>

<style>
.history-area {
  position: absolute;
  right: 0;
  z-index: 2000;
}
.operation-list {
  display: flex;
}
.history-area .bold {
  font-weight: bold;
}
</style>
