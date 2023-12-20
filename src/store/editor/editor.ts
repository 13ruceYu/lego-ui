import { defineStore } from 'pinia'
import { v4 as uuidv4 } from 'uuid'
import { textDefaultProps } from 'lego-bricks'
import type { AllComponentProps } from 'lego-bricks'

export interface IComponentData {
  // 元素属性
  props: { [key: string]: any }
  // uuid
  id: string
  // 业务组件库名称
  name: 'l-text' | 'l-image' | 'l-shape'
  // 图层名称
  layerName?: string
  // 图层是否隐藏
  isHidden?: boolean
  // 图层是否锁定
  isLocked?: boolean
}

export interface EditorProps {
  // 供中间编辑器渲染的数组
  components: IComponentData[]
  // 当前编辑的元素
  currentElement: string
  // 其余信息之后补充
}

export interface IUploadPayload {
  key: string
  value: any
  id?: string
  isRoot?: boolean
}

export interface PageProps {
  backgroundColor: string
  backgroundImage: string
  backgroundRepeat: string
  backgroundSize: string
  height: string
}
export type AllFormProps = PageProps & AllComponentProps

export const testComponents: IComponentData[] = [
  {
    id: uuidv4(),
    name: 'l-text',
    props: { ...textDefaultProps, text: 'hello', fontSize: '36px', lineHeight: '1', textAlign: 'left', opacity: '0.5', color: '#000000' },
    layerName: '图层-1',
  },
  {
    id: uuidv4(),
    name: 'l-text',
    props: { text: 'world', color: 'pink', lineHeight: '2', fontFamily: '' },
    layerName: '图层-2',
  },
  {
    id: uuidv4(),
    name: 'l-text',
    props: {
      text: 'go to google',
      color: 'green',
      actionType: 'url',
      url: 'https://google.com',
    },
    layerName: '图层-3',
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
    layerName: '图层-4',
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
    updateComponent(payload: IUploadPayload) {
      const { id, key, value, isRoot } = payload
      const updatedComponent = this.components.find(comp => comp.id === (id || this.currentElement))
      if (updatedComponent) {
        if (isRoot)
          (updatedComponent as any)[key] = value
        else
          updatedComponent.props[key] = value
      }
    },
    removeComponent(id: string) {
      this.components = this.components.filter(comp => comp.id !== id)
    },
  },
})
