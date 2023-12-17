import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import InlineEdit from '@/components/InlineEdit.vue'

describe('InlineEdit component', () => {
  expect(InlineEdit).toBeTruthy()
  const wrapper = mount(InlineEdit, {
    props: {
      value: 'test',
    },
  })
  it('should render the default layout', () => {
    expect(wrapper.get('span').text()).toBe('test')
  })
  it('should render input when click the element', async () => {
    await wrapper.trigger('click')
    const input = wrapper.get('input')?.element
    expect(input).toBeTruthy()
    expect(input.value).toBe('test')
  })
  it('press enter should render to default layout with new value', async () => {
    await wrapper.get('input').setValue('new-test')
    const event = new KeyboardEvent('keydown', { key: 'Enter' })
    document.dispatchEvent(event)
    await nextTick()
    expect(wrapper.find('span').exists()).toBeTruthy()
    expect(wrapper.get('span').text()).toBe('new-test')
    const events = wrapper.emitted('change')
    if (events)
      expect(events[0]).toEqual(['new-test'])
  })
  it('press esc should render to default layout with old value', async () => {
    await wrapper.trigger('click')
    await wrapper.get('input').setValue('new-new-test')
    const event = new KeyboardEvent('keydown', { key: 'Escape' })
    document.dispatchEvent(event)
    await nextTick()
    expect(wrapper.find('span').exists()).toBeTruthy()
    expect(wrapper.get('span').text()).toBe('new-test')
  })
  it('click outside should render to default layout with new value', async () => {
    await wrapper.trigger('click')
    await wrapper.get('input').setValue('test-updated')
    const event = new MouseEvent('click')
    document.dispatchEvent(event)
    await nextTick()
    expect(wrapper.find('span').exists()).toBeTruthy()
    expect(wrapper.get('span').text()).toBe('test-updated')
    const events = wrapper.emitted('change')
    if (events)
      expect(events[1]).toEqual(['test-updated'])
  })
})
