import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import Hello from '../src/components/Hello.vue'

describe('Hello.vue', () => {
  it('should render', () => {
    const wrapper = mount(Hello, { props: { name: 'bobo' } })
    expect(wrapper.text()).toContain('bobo')
  })
  it('should be interactive', () => {
    const wrapper = mount(Hello, { props: { name: 'world' } })
    expect(wrapper.text()).toContain('world')
  })
})
