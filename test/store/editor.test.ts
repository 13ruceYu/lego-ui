import { createPinia, setActivePinia } from 'pinia'
import { describe, expect, it } from 'vitest'
import { last } from 'lodash'
import { message } from 'ant-design-vue'
import type { IComponentData } from '@/store/editor/editor'
import { testComponents, useEditorStore } from '@/store/editor/editor'
import { textDefaultProps } from '@/constants/defaultProps'

const testComponentsClone = [...testComponents]

describe('test editor store', () => {
  setActivePinia(createPinia())
  const editorStore = useEditorStore()
  window.$message = message

  it('should have default components', () => {
    expect(editorStore.components).toHaveLength(testComponents.length)
  })

  it('should get current component when active one component', () => {
    editorStore.setActive(testComponents[0].id)
    expect(editorStore.currentElement).toBe(testComponents[0].id)
    const curEl = editorStore.getCurrentElement
    expect(curEl!.id).toBe(testComponents[0].id)
  })

  it('add component should work fine', () => {
    const payload: IComponentData = {
      name: 'l-text',
      id: '1234',
      props: {
        ...textDefaultProps,
        text: 'test-1',
      },
    }
    editorStore.addComponent(payload)
    expect(editorStore.components).toHaveLength(testComponentsClone.length + 1)
    const lastItem = last(editorStore.components)
    if (lastItem) {
      expect(lastItem.props.text).toBe('test-1')
      expect(lastItem.layerName).toBe('图层-2')
    }
  })

  it('update component should work fine', () => {
    const newProps = {
      key: 'text',
      value: 'update',
    }
    editorStore.setActive(testComponents[0].id)
    editorStore.updateComponent({ id: testComponents[0].id, key: newProps.key, value: newProps.value })
    const curEl = editorStore.getCurrentElement
    expect(curEl?.props.text).toBe(newProps.value)
  })

  it('cv component should work fine', () => {
    const curId = editorStore.components[0].id
    editorStore.copyComponent(curId)
    expect(editorStore.copiedComponent).toBeDefined()
    editorStore.pasteCopiedComponent()
    expect(editorStore.components).toHaveLength(testComponentsClone.length + 2)
  })

  it('move component should work fine', () => {
    const curEl = editorStore.getCurrentElement
    const posLeft = parseInt(curEl?.props.left || 0)
    const amount = 5
    if (curEl) {
      editorStore.moveComponent({ direction: 'Left', amount, id: curEl.id })
      expect(curEl.props.left).toBe(`${posLeft - amount}px`)
    }
  })

  it('undo should works fine', () => {
    const getCurrentAndAssert = (text: string) => {
      const currentElement = editorStore.getCurrentElement
      expect(currentElement!.props.text).toBe(text)
    }
    editorStore.resetEditor()
    const payload: IComponentData = {
      name: 'l-text',
      id: '1234',
      props: {
        ...textDefaultProps,
        text: 'text1',
      },
    }
    editorStore.addComponent(payload)
    const payload2: IComponentData = {
      name: 'l-text',
      id: '2345',
      props: {
        ...textDefaultProps,
        text: 'text2',
      },
    }
    editorStore.addComponent(payload2)
    editorStore.deleteComponent('2345')
    editorStore.updateComponent({ key: 'text', value: 'update', id: '1234' })
    editorStore.setActive('1234')
    getCurrentAndAssert('update')
    // undo step 1
    editorStore.undo()
  })
})
