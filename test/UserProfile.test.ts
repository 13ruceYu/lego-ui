import { beforeAll, describe, expect, it, vi } from 'vitest'
import type { VueWrapper } from '@vue/test-utils'
import { mount } from '@vue/test-utils'
import { message } from 'ant-design-vue'
// pinia
// import { createTestingPinia } from '@pinia/testing'
import { createPinia } from 'pinia'
import { useUserStore } from '@/store/user/user'

import UserProfile from '@/components/UserProfile.vue'

const pinia = createPinia()

vi.mock('vue-router')
vi.mock('ant-design-vue')

const mockComponent = {
  template: '<div><slot></slot></div>',
}
const mockComponent2 = {
  template: '<div><slot></slot><slot name="overlay"></slot></div>',
}

const globalComponents = {
  'a-button': mockComponent,
  'a-menu-item': mockComponent,
  'a-menu': mockComponent,
  'a-dropdown-button': mockComponent2,
  'router-link': mockComponent,
}

describe('UserProfile.vue', () => {
  let wrapper: VueWrapper
  beforeAll(() => {
    wrapper = mount(UserProfile, {
      global: {
        components: globalComponents,
        plugins: [pinia],
      },
      useUserStore,
    })
  })

  it('should render login button when login is false', async () => {
    const userStore = useUserStore()
    const btnLogin = wrapper.get('.btn-login')
    expect(btnLogin.text()).toBe('登录')
    const spyMessage = vi.spyOn(message, 'success')
    await btnLogin.trigger('click')
    expect(spyMessage).toHaveBeenCalled()
    expect(userStore.userName).toBe('bobo')
  })

  it('should render username when login is true', async () => {
    const userName = 'bobo'
    await wrapper.setProps({
      user: { isLogin: true, userName },
    })
    expect(wrapper.get('.user-profile-component').html()).toContain(userName)
    expect(wrapper.find('.user-profile-component').exists()).toBeTruthy()
  })
})
