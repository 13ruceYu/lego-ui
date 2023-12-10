import { defineStore } from 'pinia'
import { v4 as uuidv4 } from 'uuid'

export interface IComponentData {
  props: { [key: string]: any }
  id: string
  name: string
}

export interface EditorProps {
  // 供中间编辑器渲染的数组
  components: IComponentData[]
  // 当前编辑的元素
  currentElement: string
  // 其余信息之后补充
}

export const testComponents: IComponentData[] = [
  {
    id: uuidv4(),
    name: 'l-text',
    props: { text: 'hello', fontSize: '36px', lineHeight: '1', textAlign: 'left', opacity: '0.5', color: '#000000' },
  },
  { id: uuidv4(), name: 'l-text', props: { text: 'world', color: 'pink', lineHeight: '2', fontFamily: '' } },
  {
    id: uuidv4(),
    name: 'l-text',
    props: {
      text: 'go to google',
      color: 'green',
      actionType: 'url',
      url: 'https://google.com',
    },
  },
  {
    id: uuidv4(),
    name: 'l-image',
    props: {
      src: 'http://lego-backend-vue.oss-cn-hangzhou.aliyuncs.com/imooc-test/ucVvnF.png',
      actionType: '',
      url: '',
      height: '',
      width: '200px',
      paddingLeft: '0px',
      paddingRight: '0px',
      paddingTop: '0px',
      paddingBottom: '0px',
      borderStyle: 'none',
      borderColor: '#000',
      borderWidth: '0',
      borderRadius: '0',
      boxShadow: '0 0 0 #000000',
      opacity: '1',
      position: 'absolute',
      left: '0',
      top: '0',
      right: '0',
    },
  },
]

export const useEditorStore = defineStore({
  id: 'editor',
  state: (): EditorProps => ({
    components: testComponents,
    currentElement: '',
  }),
  getters: {
    getCurrentElement(state) {
      return state.components.find(comp => comp.id === state.currentElement)
    },
  },
  actions: {
    addComponent(componentData: IComponentData) {
      this.components.push(componentData)
    },
    setActive(id: string) {
      this.currentElement = id
    },
    updateComponent(key: string, value: any) {
      const updatedComponent = this.components.find(comp => comp.id === this.currentElement)
      if (updatedComponent)
        updatedComponent.props[key] = value
    },
    removeComponent(id: string) {
      this.components = this.components.filter(comp => comp.id !== id)
    },
  },
})
