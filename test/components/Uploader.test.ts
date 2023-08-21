import { flushPromises, mount, shallowMount } from '@vue/test-utils'
import type { MockedFunction } from 'vitest'
import { afterEach, describe, expect, it, vi } from 'vitest'
import axios from 'axios'
import Uploader from '@/components/Uploader.vue'

vi.mock('axios')

const testFile = new File(['xyz'], 'test.png', { type: 'image/png' })

function setInputValue(fileInput: HTMLInputElement, file: File): void {
  Object.defineProperty(fileInput, 'files', {
    value: [file],
    writable: false,
  })
}

describe('Uploader Component', () => {
  expect(Uploader).toBeTruthy()

  const wrapper = mount(Uploader, {
    props: {
      action: 'test.url',
    },
  })

  afterEach(() => {
    (axios.post as MockedFunction<typeof axios.post>).mockReset()
  })

  it('basic layout before uploading', () => {
    expect(wrapper.find('button').exists()).toBeTruthy()
    expect(wrapper.get('button').text()).toBe('点击上传')
    expect(wrapper.get('input').isVisible()).toBeFalsy()
  })

  it('upload process should work fine', async () => {
    const fileInput = wrapper.get('input').element as HTMLInputElement
    setInputValue(fileInput, testFile);
    (axios.post as MockedFunction<typeof axios.post>).mockResolvedValueOnce({
      status: 'success',
    })
    await wrapper.get('input').trigger('change')
    expect(axios.post).toHaveBeenCalledTimes(1)
    expect(wrapper.get('button').text()).toBe('正在上传')
    // disable button
    expect(wrapper.get('button').attributes()).toHaveProperty('disabled')
    // change list with correct class name
    expect(wrapper.findAll('li').length).toBe(1)
    const firstLi = wrapper.get('li:first-child')
    expect(firstLi.classes()).toContain('upload-loading')
    await flushPromises()
    expect(wrapper.get('button').text()).toBe('点击上传')
    // has correct class and filename
    expect(firstLi.classes()).toContain('upload-success')
    expect(firstLi.get('.filename').text()).toBe(testFile.name)
  })

  it('should return error text when post is rejected', async () => {
    (axios.post as MockedFunction<typeof axios.post>).mockRejectedValueOnce({ error: 'error' })
    await wrapper.get('input').trigger('change')
    expect(axios.post).toHaveBeenCalledTimes(1)
    expect(wrapper.get('button').text()).toBe('正在上传')
    await flushPromises()
    expect(wrapper.get('button').text()).toBe('点击上传')
    // list increase, last item has correct class
    expect(wrapper.findAll('li').length).toBe(2)
    const lastLi = wrapper.get('li:last-child')
    expect(lastLi.classes()).toContain('upload-error')
    // click button in li to delete
    await lastLi.get('.delete-icon').trigger('click')
    expect(wrapper.findAll('li').length).toBe(1)
  })

  it('should show the correct interface when use custom slot', async () => {
    (axios.post as MockedFunction<typeof axios.post>).mockResolvedValueOnce({
      data: { url: 'dummy.url' },
    })
    const wrapper = mount(Uploader, {
      props: {
        action: 'test.url',
      },
      slots: {
        default: '<button>custom button</button>',
        loading: '<div class="loading">custom loading</div>',
        uploaded: `
          <template #uploaded="{uploadedData}">
            <div class="custom-loaded">{{uploadedData.url}}</div>
          </template>
        `,
      },
    })
    expect(wrapper.get('button').text()).toBe('custom button')
    const fileInput = wrapper.get('input').element as HTMLInputElement
    setInputValue(fileInput, testFile)
    await wrapper.get('input').trigger('change')
    expect(wrapper.get('.loading').text()).toBe('custom loading')
    await flushPromises()
    expect(wrapper.get('.custom-loaded').text()).toBe('dummy.url')
  })

  it('before upload check', async () => {
    const cb = vi.fn();
    (axios.post as MockedFunction<typeof axios.post>).mockResolvedValueOnce({
      data: { url: 'dummy.url' },
    })
    function checkFileSize(file: File) {
      if (file.size > 2) {
        cb()
        return false
      }
      return true
    }
    const wrapper = shallowMount(Uploader, {
      props: {
        action: 'test.url',
        beforeUpload: checkFileSize,
      },
    })
    const fileInput = wrapper.get('input').element as HTMLInputElement
    setInputValue(fileInput, testFile)
    await wrapper.get('input').trigger('change')
    expect(axios.post).not.toHaveBeenCalled()
    expect(wrapper.findAll('li').length).toBe(0)
    expect(cb).toHaveBeenCalled()
  })

  it('before upload check using Promise', async () => {
    (axios.post as MockedFunction<typeof axios.post>).mockResolvedValueOnce({
      data: { url: 'dummy.url' },
    })
    function failedPromise() {
      // eslint-disable-next-line prefer-promise-reject-errors
      return Promise.reject('wrong type')
    }
    function successPromise(file: File) {
      const newFile = new File([file], 'new_file.docx', { type: file.type })
      return Promise.resolve(newFile)
    }
    function successPromiseWithWrongType() {
      return Promise.resolve('abcd')
    }
    const wrapper = shallowMount(Uploader, {
      props: {
        action: 'test.url',
        beforeUpload: failedPromise,
      },
    })
    const fileInput = wrapper.get('input').element as HTMLInputElement
    setInputValue(fileInput, testFile)
    await wrapper.get('input').trigger('change')
    await flushPromises()
    expect(axios.post).not.toHaveBeenCalled()
    expect(wrapper.findAll('li').length).toBe(0)
    // success promise with wrong file
    await wrapper.setProps({ beforeUpload: successPromiseWithWrongType })
    await wrapper.get('input').trigger('change')
    await flushPromises()
    expect(axios.post).not.toHaveBeenCalled()
    // success promise with file
    await wrapper.setProps({ beforeUpload: successPromise })
    await wrapper.get('input').trigger('change')
    await flushPromises()
    expect(axios.post).toHaveBeenCalled()
    const firstLi = wrapper.get('li:first-child')
    expect(firstLi.classes()).toContain('upload-success')
    expect(firstLi.get('.filename').text()).toBe('new_file.docx')
  })

  it('test drag and drop function', async () => {
    (axios.post as MockedFunction<typeof axios.post>).mockResolvedValueOnce({ data: { url: 'dummy.url' } })
    const wrapper = shallowMount(Uploader, {
      props: {
        action: 'test.url',
        drag: true,
      },
    })
    const uploadArea = wrapper.get('.upload-area')
    await uploadArea.trigger('dragover')
    expect(uploadArea.classes()).toContain('is-dragover')
    await uploadArea.trigger('dragleave')
    expect(uploadArea.classes()).not.toContain('is-dragover')
    await uploadArea.trigger('drop', { dataTransfer: { files: [testFile] } })
    expect(axios.post).toHaveBeenCalled()
    await flushPromises()
    expect(wrapper.findAll('li').length).toBe(1)
  })

  it('test manual upload process', async () => {
    (axios.post as MockedFunction<typeof axios.post>).mockResolvedValueOnce({ data: { url: 'dummy.url' } })
    const wrapper = shallowMount(Uploader, {
      props: {
        action: 'test.url',
        drag: true,
        autoUpload: false,
      },
    })
    const fileInput = wrapper.get('input').element as HTMLInputElement
    setInputValue(fileInput, testFile)
    await wrapper.get('input').trigger('change')
    expect(wrapper.findAll('li').length).toBe(1)
    const firstLi = wrapper.get('li:first-child')
    expect(firstLi.classes()).toContain('upload-ready')
    wrapper.vm.uploadFiles()
    expect(axios.post).toHaveBeenCalled()
    await flushPromises()
    expect(firstLi.classes()).toContain('upload-success')
  })
  it('PictureList mode should work fine', async () => {
    (axios.post as MockedFunction<typeof axios.post>).mockResolvedValueOnce({ data: { url: 'dummy.url' } })
    window.URL.createObjectURL = vi.fn(() => {
      return 'test.url'
    })
    const wrapper = shallowMount(Uploader, {
      props: {
        action: 'test.url',
        listType: 'picture',
      },
    })
    expect(wrapper.get('ul').classes()).toContain('upload-list-picture')
    const fileInput = wrapper.get('input').element as HTMLInputElement
    setInputValue(fileInput, testFile)
    await wrapper.get('input').trigger('change')
    await flushPromises()
    expect(wrapper.findAll('li').length).toBe(1)
    expect(wrapper.find('li:first-child img').exists()).toBeTruthy()
    const firstImg = wrapper.get('li:first-child img')
    expect(firstImg.attributes('src')).toEqual('test.url')
  })
})
