import { defineComponent } from 'vue'

export default defineComponent({
  props: {
    name: {
      type: String,
      required: true,
    },
  },
  render() {
    return (
      <div>
        <h1>Hello, {this.name}!</h1>
      </div>
    )
  },
})
