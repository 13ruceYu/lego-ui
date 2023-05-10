import { defineStore } from 'pinia'
import { v4 as uuidv4 } from 'uuid'

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
  { id: uuidv4(), name: 'l-text', props: { text: 'world', color: 'pink' } }
]

export const useEditorStore = defineStore({
  id: 'editor',
  state: (): EditorProps => ({
    components: testComponents,
    currentElement: ''
  })
})
