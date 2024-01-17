<script lang="ts">
import { computed, defineComponent, onMounted } from 'vue'
import TemplateList from '@/components/TemplateList.vue'
import { useTemplateStore } from '@/store/template/template'

export default defineComponent({
  components: {
    TemplateList,
  },
  setup() {
    const templateStore = useTemplateStore()
    const testData = computed(() => templateStore.data)
    // const isLoading = computed(() => store.getters.isOpLoading('fetchTemplates'))
    const isLoading = false
    onMounted(() => {
      templateStore.getTemplates()
    })
    return {
      testData,
      isLoading,
    }
  },
})
</script>

<template>
  <div class="content-container">
    <h1 v-if="isLoading">
      templates is Loading!
    </h1>
    <TemplateList :list="testData" />
  </div>
</template>

<style>
.page-title {
  color: #fff;
}
.content-container {
  background: #fff;
  padding: 0 24px 24px 30px;
  min-height: 85vh;
  max-width: 1200px;
  margin: 50px auto;
  width: 100%;
}
</style>
