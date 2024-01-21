import { defineStore } from 'pinia'
import { v4 as uuidv4 } from 'uuid'
import { textDefaultProps } from 'lego-bricks'
import type { AllComponentProps } from 'lego-bricks'
import { cloneDeep } from 'lodash'

export interface PageProps {
  backgroundColor: string
  backgroundImage: string
  backgroundRepeat: string
  backgroundSize: string
  height: string
}
export type AllFormProps = PageProps & AllComponentProps

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

export interface PageData {
  props: PageProps
  title: string
}

export interface EditorProps {
  // 供中间编辑器渲染的数组
  components: IComponentData[]
  // 当前编辑的元素
  currentElement: string
  // 其余信息之后补充
  page: PageData
  // 当前被复制的组件
  copiedComponent?: IComponentData
}

export interface IUploadPayload {
  key: string
  value: any
  id?: string
  isRoot?: boolean
}

type MoveDirection =
  'Up' | 'Down' | 'Right' | 'Left'

export const testComponents: IComponentData[] = [
  {
    id: uuidv4(),
    name: 'l-text',
    props: {
      ...textDefaultProps,
      text: 'hello',
      fontSize: '36px',
      lineHeight: '1',
      textAlign: 'left',
      opacity: '0.5',
      color: '#000000',
      width: '100px',
      height: '100px',
      left: '60px',
      top: '60px',
      position: 'absolute',
      backgroundColor: '#999999',
    },
    layerName: '图层-1',
  },
  // {
  //   id: uuidv4(),
  //   name: 'l-text',
  //   props: { text: 'world', color: 'pink', lineHeight: '2', fontFamily: '' },
  //   layerName: '图层-2',
  // },
  // {
  //   id: uuidv4(),
  //   name: 'l-text',
  //   props: {
  //     text: 'go to google',
  //     color: 'green',
  //     actionType: 'url',
  //     url: 'https://google.com',
  //   },
  //   layerName: '图层-3',
  // },
  // {
  //   id: uuidv4(),
  //   name: 'l-image',
  //   props: {
  //     src: 'http://lego-backend-vue.oss-cn-hangzhou.aliyuncs.com/imooc-test/ucVvnF.png',
  //     actionType: '',
  //     url: '',
  //     height: '',
  //     width: '200px',
  //     paddingLeft: '0px',
  //     paddingRight: '0px',
  //     paddingTop: '0px',
  //     paddingBottom: '0px',
  //     borderStyle: 'none',
  //     borderColor: '#000',
  //     borderWidth: '0',
  //     borderRadius: '0',
  //     boxShadow: '0 0 0 #000000',
  //     opacity: '1',
  //     position: 'absolute',
  //     left: '0',
  //     top: '0',
  //     right: '0',
  //   },
  //   layerName: '图层-4',
  // },
]

const pageDefaultProps = {
  backgroundColor: 'green',
  backgroundImage: '',
  // backgroundImage: 'url("https://static.imooc-lego.com/upload-files/%E5%B9%BC%E5%84%BF%E5%9B%AD%E8%83%8C%E6%99%AF%E5%9B%BE-994372.jpg")',
  backgroundRepeat: 'no-repeat',
  backgroundSize: 'cover',
  height: '560px',
}

export const useEditorStore = defineStore({
  id: 'editor',
  state: (): EditorProps => ({
    components: testComponents,
    currentElement: '',
    page: {
      title: 'test title',
      props: pageDefaultProps,
    },
  }),
  getters: {
    getCurrentElement(state) {
      return state.components.find(comp => comp.id === state.currentElement)
    },
    getElement(state) {
      return (id: string) => state.components.find(comp => comp.id === id)
    },
  },
  actions: {
    copyComponent(id: string) {
      const curEl = this.getElement(id)
      if (curEl) {
        this.copiedComponent = curEl
        window.$message.success('拷贝成功')
      }
    },
    pasteCopiedComponent() {
      if (this.copiedComponent) {
        const clone = cloneDeep(this.copiedComponent)
        clone.id = uuidv4()
        clone.layerName = `${this.copiedComponent.layerName} 副本`
        this.components.push(clone)
        window.$message.success('黏贴成功')
      }
    },
    addComponent(componentData: IComponentData) {
      this.components.push({ ...componentData, layerName: `图层-${this.components.length + 1}` })
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
    deleteComponent(id: string) {
      this.components = this.components.filter(comp => comp.id !== id)
    },
    moveComponent(data: { direction: MoveDirection; amount: number; id: string }) {
      const { direction, amount, id } = data
      const curEl = this.getElement(id)
      if (curEl) {
        const oldTop = parseInt(curEl.props.top || 0)
        switch (direction) {
          case 'Up': {
            const newVal = `${oldTop - amount}px`
            this.updateComponent({ key: 'top', value: newVal, id })
            break
          }
          default:
            break
        }
      }
    },
    updatePage({ key, value }: IUploadPayload) {
      this.page.props[key as keyof PageProps] = value
    },
  },
})
