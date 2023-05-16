// MyComponent.tsx
import type { PropType } from 'vue'
import { defineComponent } from 'vue'

export default defineComponent({
  props: {
    name: {
      type: String as PropType<string>,
      required: true
    }
  },
  render() {
    return (
      <div>
        <h1>Hello, {this.name}!</h1>
      </div>
    )
  }
})
