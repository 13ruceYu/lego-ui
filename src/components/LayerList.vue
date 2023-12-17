<script lang="ts" setup>
import draggable from 'vuedraggable'
import Icon, { DragOutlined, EyeInvisibleOutlined, EyeOutlined, LockOutlined, UnlockOutlined } from '@ant-design/icons-vue'
import InlineEdit from './InlineEdit.vue'
import type { IComponentData } from '@/store/editor/editor'

interface IProps {
  list: IComponentData[]
  selectedId: string | undefined
}
const props = defineProps<IProps>()
const emits = defineEmits(['change', 'select'])

function handleChange(id: string, key: string, value: boolean) {
  const data = { id, key, value, isRoot: true }
  emits('change', data)
}
</script>

<template>
  <draggable :list="props.list" ghost-class="opacity-60" class="layer-list" item-key="id" handle=".drag-btn">
    <template #item="{ element }">
      <div
        class="flex justify-between items-center border border-cyan-100 p-2 hover:bg-cyan-100 cursor-pointer"
        @click="emits('select', element.id)"
      >
        <div class="name">
          <!-- {{ element.layerName }} -->
          <InlineEdit :value="element.layerName || ''" @change="value => handleChange(element.id, 'layName', false)" />
        </div>
        <div class="opts shrink-0">
          <a-tooltip :title="element.isHidden ? '隐藏' : '显示'">
            <a-button shape="circle">
              <template #icon>
                <Icon :component="element.isHidden ? EyeInvisibleOutlined : EyeOutlined" />
              </template>
            </a-button>
          </a-tooltip>
          <a-tooltip :title="element.isLocked ? '锁定' : '解锁'">
            <a-button shape="circle" @click="handleChange(element.id, 'isLocked', !element.isLocked)">
              <template #icon>
                <Icon :component="element.isLocked ? LockOutlined : UnlockOutlined" />
              </template>
            </a-button>
          </a-tooltip>
          <a-tooltip title="拖动">
            <a-button shape="circle" class="drag-btn">
              <template #icon>
                <Icon :component="DragOutlined" />
              </template>
            </a-button>
          </a-tooltip>
        </div>
      </div>
    </template>
  </draggable>
</template>
