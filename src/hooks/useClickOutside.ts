import type { Ref } from 'vue'
import { onMounted, onUnmounted, ref } from 'vue'

export function useClickOutside(elementRef: Ref<null | HTMLElement>) {
  const isClickOutside = ref()
  const handler = (e: MouseEvent) => {
    if (elementRef.value && e.target) {
      if (elementRef.value.contains(e.target as HTMLElement))
        isClickOutside.value = false
      else
        isClickOutside.value = true
    }
  }
  onMounted(() => {
    document.addEventListener('click', handler)
  })
  onUnmounted(() => {
    document.removeEventListener('click', handler)
  })
  return isClickOutside
}
