<script lang="ts" setup>
import Icon, { EyeInvisibleOutlined, EyeOutlined, LockOutlined, UnlockOutlined } from '@ant-design/icons-vue'
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
  <div class="layer-list">
    <div
      v-for="item in props.list"
      :key="item.id" :class="{
        active:
          item.id === props.selectedId,
      }"
      class="flex justify-between items-center border border-cyan-100 p-2 hover:bg-cyan-100 cursor-pointer"
      @click="emits('select', item.id)"
    >
      <div class="name">
        {{ item.layerName }}
      </div>
      <div class="opts">
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
    </div>
  </div>
</template>
