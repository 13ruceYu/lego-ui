import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it } from 'vitest'
import { last } from 'lodash'
import type { TextComponentProps } from '@/constants/defaultProps'
import { testComponents, useEditorStore } from '@/store/editor/editor'

const testComponentsClone = [...testComponents]

describe('test editor store', () => {
  beforeEach(() => {
    // creates a fresh pinia and make it active so it's automatically picked
    // up by any useStore() call without having to pass it to it:
    // `useStore(pinia)`
    setActivePinia(createPinia())
  })

  it('should have default components', () => {
    const editorStore = useEditorStore()
    expect(editorStore.components).toHaveLength(testComponents.length)
  })

  it('should get current component when active one component', () => {
    const editorStore = useEditorStore()
    editorStore.setActive(testComponents[0].id)
    expect(editorStore.currentElement).toBe(testComponents[0].id)
    const curEl = editorStore.getCurrentElement
    expect(curEl!.id).toBe(testComponents[0].id)
  })

  it('add component should work fine', () => {
    const editorStore = useEditorStore()
    const payload: Partial<TextComponentProps> = {
      text: 'test-1',
    }
    editorStore.addComponent(payload)
    expect(editorStore.components).toHaveLength(testComponentsClone.length + 1)
    const lastItem = last(editorStore.components)
    expect(lastItem?.props.text).toBe('test-1')
  })

  it('update component should work fine', () => {
    const editorStore = useEditorStore()
    const newProps = {
      key: 'text',
      value: 'update',
    }
    editorStore.setActive(testComponents[0].id)
    editorStore.updateComponent(newProps.key, newProps.value)
    const curEl = editorStore.getCurrentElement
    expect(curEl?.props.text).toBe(newProps.value)
  })
})
