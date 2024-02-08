<script lang="ts">
import type { PropType } from 'vue'
import { defineComponent } from 'vue'
import { CopyOutlined, DeleteOutlined, DownloadOutlined, EditOutlined, EllipsisOutlined } from '@ant-design/icons-vue'
import { Modal } from 'ant-design-vue'
import type { TemplateProps } from '@/store/template'

export default defineComponent({
  name: 'WorksList',
  components: {
    EditOutlined,
    EllipsisOutlined,
    CopyOutlined,
    DeleteOutlined,
    DownloadOutlined,
  },
  props: {
    list: {
      type: Array as PropType<TemplateProps[]>,
      required: true,
    },
    loading: {
      type: Boolean,
      default: false,
    },
    transferStatus: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['onCopy', 'onDelete'],
  setup(props, context) {
    const deleteClicked = (id: number) => {
      Modal.confirm({
        title: '确定要删除该作品吗？',
        okText: '删除',
        okType: 'danger',
        cancelText: '取消',
        onOk: () => {
          context.emit('onDelete', id)
        },
      })
    }
    const copyClicked = (id: number) => {
      context.emit('onCopy', id)
    }

    return {
      deleteClicked,
      copyClicked,
    }
  },
})
</script>

<template>
  <div class="works-list-component">
    <a-skeleton v-if="loading" />
    <a-row v-else :gutter="16">
      <a-col v-for="item in list" :key="item.id" :span="6" class="poster-item">
        <a-card hoverable>
          <template #cover>
            <img v-if="item.coverImg" :src="item.coverImg">
            <img v-else src="http://typescript-vue.oss-cn-beijing.aliyuncs.com/vue-marker/5f81cca3f3bf7a0e1ebaf885.png">
            <div class="hover-item">
              <router-link :to="`/editor/${item.id}`">
                <a-button size="large" type="primary">
                  继续编辑该作品
                </a-button>
              </router-link>
            </div>
          </template>
          <template #actions>
            <router-link :to="`/editor/${item.id}`">
              <EditOutlined key="edit" />
            </router-link>
            <a-dropdown>
              <EllipsisOutlined key="ellipsis" />
              <template #overlay>
                <a-menu class="overlay-dropdown">
                  <a-menu-item>
                    <a href="javascript:;" @click.prevent="copyClicked(item.id)"><CopyOutlined /> 复制</a>
                  </a-menu-item>
                  <a-menu-item>
                    <a href="javascript:;" @click.prevent="deleteClicked(item.id)"><DeleteOutlined /> 删除</a>
                  </a-menu-item>
                  <a-menu-item v-if="item.coverImg">
                    <a href="javascript:;"><DownloadOutlined /> 下载图片</a>
                  </a-menu-item>
                </a-menu>
              </template>
            </a-dropdown>
          </template>
          <a-card-meta :title="item.title" />
        </a-card>
        <div class="tag-list">
          <a-tag v-if="item.status === 1" color="red">
            未发布
          </a-tag>
          <a-tag v-if="item.status === 2" color="green">
            已发布
          </a-tag>
        </div>
      </a-col>
    </a-row>
  </div>
</template>
