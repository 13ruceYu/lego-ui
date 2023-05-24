import { defineComponent } from 'vue'

const RenderVNode = defineComponent({
  props: {
    customNode: {
      type: [Object, String],
      required: true
    }
  },
  render() {
    return this.customNode
  }
})

export default RenderVNode
