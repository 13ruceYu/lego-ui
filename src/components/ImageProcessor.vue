<script lang="ts" setup>
import { computed, nextTick, ref, watch } from 'vue'
import Cropper from 'cropperjs'

interface ICropDataProps {
  width: number
  height: number
  x: number
  y: number
}

const props = defineProps(['value'])
const emits = defineEmits(['change'])

const open = ref<boolean>(false)
const imageCrop = ref(null)
const baseImageURL = computed(() => props.value.split('?')[0])
const dataURL = ref('')

let cropData: ICropDataProps | null = null
let cropper: Cropper

function showModal() {
  open.value = true
}
function handleOk() {
  if (cropData) {
    const { x, y, height, width } = cropData
    const cropURL = `${baseImageURL.value}?x-oss-process=image/crop,x_${x},y_${y},w_${width},h_${height}`
    emits('change', cropURL)
  }
  // open.value = false
}

watch(open, async (newVal) => {
  if (newVal) {
    await nextTick()
    if (imageCrop.value) {
      cropper = new Cropper(imageCrop.value, {
        checkCrossOrigin: false,
        crop(event) {
          const { x, y, width, height } = event.detail
          cropData = {
            x: Math.floor(x),
            y: Math.floor(y),
            width: Math.floor(width),
            height: Math.floor(height),
          }
        },
      })
    }
  }
  else {
    cropper.destroy()
  }
})
</script>

<template>
  <div class="image-processor flex">
    <div class="thumbnail mr-2 w-14">
      <img :src="props.value" alt="thumb">
    </div>
    <div>
      <a-button type="primary" class="mb-2" @click="showModal">
        图片裁剪
      </a-button><br>
      <a-button>图片替换</a-button>
    </div>
    <a-modal v-model:visible="open" title="Basic Modal" @ok="handleOk">
      <div>
        <img :src="dataURL">
      </div>
      <div>
        <img ref="imageCrop" :src="props.value">
      </div>
    </a-modal>
  </div>
</template>

<style scoped>
img {
  display: block;
  /* This rule is very important, please don't ignore this */
  max-width: 100%;
}
</style>
