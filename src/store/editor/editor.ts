import { defineStore } from 'pinia'
import { v4 as uuidv4 } from 'uuid'
import type { TextComponentProps } from '@/constants/defaultProps'

interface ComponentData {
  props: { [key: string]: any }
  id: string
  name: string
}

export interface EditorProps {
  // 供中间编辑器渲染的数组
  components: ComponentData[]
  // 当前编辑的元素
  currentElement: string
  // 其余信息之后补充
}

export const testComponents: ComponentData[] = [
  { id: uuidv4(), name: 'l-text', props: { text: 'hello', fontSize: '36px' } },
  { id: uuidv4(), name: 'l-text', props: { text: 'world', color: 'pink' } },
  {
    id: uuidv4(),
    name: 'l-text',
    props: {
      text: 'go to google',
      color: 'green',
      actionType: 'url',
      url: 'https://google.com'
    }
  }
]

export const useEditorStore = defineStore({
  id: 'editor',
  state: (): EditorProps => ({
    components: testComponents,
    currentElement: ''
  }),
  getters: {
    getCurrentElement(state) {
      return state.components.find((comp) => comp.id === state.currentElement)
    }
  },
  actions: {
    addComponent(props: Partial<TextComponentProps>) {
      const newComponent: ComponentData = {
        id: uuidv4(),
        name: 'l-text',
        props
      }
      this.components.push(newComponent)
    },
    setActive(id: string) {
      this.currentElement = id
    }
  }
})
