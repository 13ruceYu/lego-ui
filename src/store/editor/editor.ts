import { defineStore } from 'pinia'
import { v4 as uuidv4 } from 'uuid'
import type { AllComponentProps } from 'lego-bricks'
import { cloneDeep, findIndex } from 'lodash'
import { textDefaultProps } from '@/constants/defaultProps'
import { insertAt } from '@/utils/helper'

export interface HistoryProps {
  id: string
  componentId: string
  type: 'add' | 'delete' | 'modify'
  data: any
  index?: number // 图层顺序
}

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
  id?: string
  title?: string
  desc?: string
  coverImg?: string
  props?: PageProps
  uuid?: string
  setting?: { [key: string]: any }
}

export interface ChannelProps {
  id: string
  name: string
  workId: number
  status?: number
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
  histories: HistoryProps[]
  historyIndex: number
  cachedOldValues?: any
  maxHistoryNumber: number
  isDirty: boolean
  channels: ChannelProps[]
}

export interface IUploadPayload {
  key: string
  value: any
  id?: string
  isRoot?: boolean
  isSetting?: boolean
}

export interface UpdateComponentData {
  key: string | string[]
  value: string | string[]
  id: string
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

function _debounceChange(func: Function, delay = 500) {
  let timer: ReturnType<typeof setTimeout>
  return function (this: any, ...args: any[]) {
    clearTimeout(timer)
    timer = setTimeout(() => {
      func.apply(this, args)
    }, delay)
  }
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
    histories: [],
    historyIndex: -1,
    cachedOldValues: null,
    maxHistoryNumber: 10,
    isDirty: false,
    channels: [],
  }),
  getters: {
    getCurrentElement(state) {
      return state.components.find(comp => comp.id === state.currentElement)
    },
    getElement(state) {
      return (id: string) => state.components.find(comp => comp.id === id)
    },
    checkUndoDisable(state) {
      // 1 no history item
      // 2 move to the first item
      if (state.histories.length === 0 || state.historyIndex === 0)
        return true

      return false
    },
    checkRedoDisable: (state) => {
      // 1 no history item
      // 2 move to the last item
      // 3 never undo before
      if (state.histories.length === 0
        || state.historyIndex === state.histories.length
        || state.historyIndex === -1)
        return true

      return false
    },
  },
  actions: {
    resetEditor() {
      this.components = []
      this.currentElement = ''
      this.histories = []
      this.historyIndex = -1
    },
    copyComponent(id: string) {
      const curEl = this.getElement(id)
      if (curEl) {
        this.copiedComponent = curEl
        window.$message.success('拷贝成功')
      }
    },
    pasteCopiedComponent() {
      this.isDirty = true
      if (this.copiedComponent) {
        const clone = cloneDeep(this.copiedComponent)
        clone.id = uuidv4()
        clone.layerName = `${this.copiedComponent.layerName} 副本`
        this.components.push(clone)
        this.histories.push({
          id: uuidv4(),
          componentId: clone.id,
          type: 'add',
          data: cloneDeep(clone),
        })
        window.$message.success('黏贴成功')
      }
    },
    addComponent(componentData: IComponentData) {
      this.isDirty = true
      const comp = { ...componentData, layerName: `图层-${this.components.length + 1}` }
      this.components.push(comp)
      this.histories.push({
        id: uuidv4(),
        componentId: componentData.id,
        type: 'add',
        data: cloneDeep(comp),
      })
    },
    setActive(id: string) {
      this.currentElement = id
    },
    modifyHistory(history: HistoryProps, type: 'undo' | 'redo') {
      const { componentId, data } = history
      const { key, oldValue, newValue } = data
      const newKey = key as keyof AllComponentProps | Array<keyof AllComponentProps>
      const updatedComponent = this.components.find(component => component.id === componentId)
      if (updatedComponent) {
        // check if key is array
        if (Array.isArray(newKey)) {
          newKey.forEach((keyName, index) => {
            updatedComponent.props[keyName] = type === 'undo' ? oldValue[index] : newValue[index]
          })
        }
        else {
          updatedComponent.props[newKey] = type === 'undo' ? oldValue : newValue
        }
      }
    },
    debounceHistory: _debounceChange(function (this: any, { key, value, id }: UpdateComponentData) {
      this.pushHistory({
        id: uuidv4(),
        componentId: id,
        type: 'modify',
        data: { oldValue: this.cachedOldValues, key, newValue: value },
      })
      this.cachedOldValues = null
    }),
    pushHistory(historyRecord: HistoryProps) {
      // check historyIndex is already moved
      if (this.historyIndex !== -1) {
        // if moved, delete all the records greater than the index
        this.histories = this.histories.slice(0, this.historyIndex)
        // move historyIndex to unmoved
        this.historyIndex = -1
      }
      // check length
      if (this.histories.length < this.maxHistoryNumber) {
        this.histories.push(historyRecord)
      }
      else {
        // larger than max number
        // shift the first
        // push to last
        this.histories.shift()
        this.histories.push(historyRecord)
      }
    },
    updateComponent(payload: UpdateComponentData) {
      this.isDirty = true
      const { id, key, value, isRoot } = payload
      const updatedComponent = this.components.find(comp => comp.id === (id || this.currentElement))
      if (updatedComponent) {
        if (isRoot) {
          (updatedComponent as any)[key as string] = value
        }
        else {
          const oldValue = Array.isArray(key) ? key.map(key => updatedComponent.props[key]) : updatedComponent.props[key]
          this.debounceHistory({ key, value, id })
          if (!this.cachedOldValues)
            this.cachedOldValues = oldValue

          if (Array.isArray(key) && Array.isArray(value)) {
            key.forEach((keyName, index) => {
              updatedComponent.props[keyName] = value[index]
            })
          }
          else if (typeof key === 'string' && typeof value === 'string') {
            updatedComponent.props[key] = value
          }
        }
      }
    },
    deleteComponent(id: string) {
      this.isDirty = true
      const curComp = this.getElement(id)
      if (curComp) {
        this.components = this.components.filter(comp => comp.id !== id)
        this.histories.push({
          id: uuidv4(),
          componentId: id,
          type: 'delete',
          data: curComp,
          index: findIndex(this.components, comp => comp.id === id),
        })
        window.$message.success('删除成功')
      }
    },
    moveComponent(data: { direction: MoveDirection; amount: number; id: string }) {
      this.isDirty = true
      const { direction, amount, id } = data
      const curEl = this.getElement(id)
      if (curEl) {
        const oldTop = parseInt(curEl.props.top || 0)
        const oldLeft = parseInt(curEl.props.left || 0)
        switch (direction) {
          case 'Up': {
            const newVal = `${oldTop - amount}px`
            this.updateComponent({ key: 'top', value: newVal, id })
            break
          }
          case 'Left': {
            const newVal = `${oldLeft - amount}px`
            this.updateComponent({ key: 'left', value: newVal, id })
            break
          }
          default:
            break
        }
      }
    },
    updatePage({ key, value, isRoot, isSetting }: IUploadPayload) {
      this.isDirty = true
      if (isRoot) {
        this.page[key as keyof PageData] = value
      }
      else if (isSetting) {
        this.page.setting = {
          ...this.page.setting,
          [key]: value,
        }
      }
      else { this.page.props && (this.page.props[key as keyof PageProps] = value) }
    },
    undo() {
      // never undo before
      if (this.historyIndex === -1) {
        this.historyIndex = this.histories.length - 1
      }
      else {
        // undo to prev
        this.historyIndex--
      }
      // get history record
      const history = this.histories[this.historyIndex]
      switch (history.type) {
        case 'add':
          this.components = this.components.filter(comp => comp.id !== history.componentId)
          break
        case 'delete':
          this.components = insertAt(this.components, history.index as number, history)
          break
        case 'modify': {
          this.modifyHistory(history, 'undo')
          break
        }
        default:
          break
      }
    },
    redo() {
      // can't redo when historyIndex is the last item or historyIndex is never moved
      if (this.historyIndex === -1)
        return

      // get the record
      const history = this.histories[this.historyIndex]
      // process the history data
      switch (history.type) {
        case 'add':
          this.components.push(history.data)
          // state.components = insertAt(state.components, history.index as number, history.data)
          break
        case 'delete':
          this.components = this.components.filter(component => component.id !== history.componentId)
          break
        case 'modify': {
          this.modifyHistory(history, 'redo')
          break
        }
        default:
          break
      }
      this.historyIndex++
    },
  },
})
