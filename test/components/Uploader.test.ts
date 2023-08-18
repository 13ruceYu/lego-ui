import { flushPromises, mount } from '@vue/test-utils'
import type { MockedFunction } from 'vitest'
import { describe, expect, it, vi } from 'vitest'
import axios from 'axios'
import Uploader from '@/components/Uploader.vue'

vi.mock('axios')

describe('Uploader Component', () => {
  expect(Uploader).toBeTruthy()

  const wrapper = mount(Uploader, {
    props: {
      action: 'test.url',
    },
  })

  it('basic layout before uploading', () => {
    expect(wrapper.find('button').exists()).toBeTruthy()
    expect(wrapper.get('button span').text()).toBe('点击上传')
    expect(wrapper.get('input').isVisible()).toBeFalsy()
  })

  it('upload process should work fine', async () => {
    const fileInput = wrapper.get('input').element as HTMLInputElement
    const testFile = new File(['xyz'], 'test.png', { type: 'image/png' })
    Object.defineProperty(fileInput, 'files', {
      value: [testFile],
      writable: false,
    });
    (axios.post as MockedFunction<typeof axios.post>).mockResolvedValueOnce({
      status: 'success',
    })
    await wrapper.get('input').trigger('change')
    expect(axios.post).toHaveBeenCalledTimes(1)
    expect(wrapper.get('button span').text()).toBe('正在上传')
    // disable button
    expect(wrapper.get('button').attributes()).toHaveProperty('disabled')
    // change list with correct class name
    expect(wrapper.findAll('li').length).toBe(1)
    const firstLi = wrapper.get('li:first-child')
    expect(firstLi.classes()).toContain('upload-loading')
    await flushPromises()
    expect(wrapper.get('button span').text()).toBe('点击上传')
    // has correct class and filename
    expect(firstLi.classes()).toContain('upload-success')
    expect(firstLi.get('.filename').text()).toBe(testFile.name)
  })

  it('should return error text when post is rejected', async () => {
    (axios.post as MockedFunction<typeof axios.post>).mockRejectedValueOnce({ error: 'error' })
    await wrapper.get('input').trigger('change')
    expect(axios.post).toHaveBeenCalledTimes(2)
    expect(wrapper.get('button span').text()).toBe('正在上传')
    await flushPromises()
    expect(wrapper.get('button span').text()).toBe('点击上传')
    // list increase, last item has correct class
    expect(wrapper.findAll('li').length).toBe(2)
    const lastLi = wrapper.get('li:last-child')
    expect(lastLi.classes()).toContain('upload-error')
    // click button in li to delete
    await lastLi.get('.delete-icon').trigger('click')
    expect(wrapper.findAll('li').length).toBe(1)
  })
})
