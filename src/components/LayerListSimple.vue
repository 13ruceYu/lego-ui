<script lang="ts" setup>
import Icon, { EyeInvisibleOutlined, EyeOutlined, LockOutlined, UnlockOutlined } from '@ant-design/icons-vue'
import { reactive } from 'vue'
import { arrayMoveMutable } from 'array-move'
import InlineEdit from './InlineEdit.vue'
import type { IComponentData } from '@/store/editor/editor'

interface IProps {
  list: IComponentData[]
  selectedId: string | undefined
}
const props = defineProps<IProps>()
const emits = defineEmits(['change', 'select', 'drop'])

const dragData = reactive({
  curDragId: '',
  curDragIndex: -1,
})

let start = -1
let end = -1

function handleChange(id: string, key: string, value: boolean) {
  const data = { id, key, value, isRoot: true }
  emits('change', data)
}

function onDragStart(e: DragEvent, id: string, idx: number) {
  dragData.curDragId = id
  dragData.curDragIndex = idx
  start = idx
}

function onDrop() {
  emits('drop', { start, end })
  dragData.curDragId = ''
}

function onDragOver(e: DragEvent) {
  e.preventDefault()
}

function onDragEnter(e: DragEvent, index: number) {
  if (index !== dragData.curDragIndex) {
    arrayMoveMutable(props.list, dragData.curDragIndex, index)
    dragData.curDragIndex = index
    end = index
  }
}
</script>

<template>
  <ul class="layer-list" @dragover="onDragOver">
    <li
      v-for="(item, idx) in props.list"
      :key="item.id"
      :class="{
        'active': item.id === props.selectedId,
        'opacity-60': item.id === dragData.curDragId,
      }"
      class="layer-list-item flex justify-between items-center border border-cyan-100 p-2 hover:bg-cyan-100 cursor-pointer"
      draggable="true"
      :data-index="idx"
      @click="emits('select', item.id)"
      @dragstart="onDragStart($event, item.id, idx)"
      @drop="onDrop"
      @dragenter="onDragEnter($event, idx)"
    >
      <div class="name">
        <InlineEdit :value="item.layerName || ''" @change="value => handleChange(item.id, 'layName', false)" />
      </div>
      <div class="opts shrink-0">
        <a-tooltip :title="item.isHidden ? '隐藏' : '显示'">
          <a-button shape="circle">
            <template #icon>
              <Icon :component="item.isHidden ? EyeInvisibleOutlined : EyeOutlined" />
            </template>
          </a-button>
        </a-tooltip>
        <a-tooltip :title="item.isLocked ? '锁定' : '解锁'">
          <a-button shape="circle" @click="handleChange(item.id, 'isLocked', !item.isLocked)">
            <template #icon>
              <Icon :component="item.isLocked ? LockOutlined : UnlockOutlined" />
            </template>
          </a-button>
        </a-tooltip>
      </div>
    </li>
  </ul>
</template>
