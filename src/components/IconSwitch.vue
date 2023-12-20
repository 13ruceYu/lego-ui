<script lang="ts">
import { defineComponent } from 'vue'
import { BoldOutlined, ItalicOutlined, UnderlineOutlined } from '@ant-design/icons-vue'

export default defineComponent({
  components: {
    BoldOutlined,
    ItalicOutlined,
    UnderlineOutlined,
  },
  props: {
    iconName: {
      type: String,
      required: true,
    },
    checked: {
      type: Boolean,
      default: false,
    },
    tip: {
      type: String,
    },
  },
  emits: ['change'],
  setup(props, context) {
    const handleClick = () => {
      context.emit('change', !props.checked)
    }
    return {
      handleClick,
    }
  },
})
</script>

<template>
  <div @click.prevent="handleClick">
    <a-tooltip>
      <template #title>
        {{ tip }}
      </template>
      <a-button :type="checked ? 'primary' : 'default'" shape="circle">
        <template #icon>
          <component :is="iconName" />
        </template>
      </a-button>
    </a-tooltip>
  </div>
</template>
