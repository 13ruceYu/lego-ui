import { beforeAll, describe, expect, it, vi } from 'vitest'
import type { VueWrapper } from '@vue/test-utils'
import { mount } from '@vue/test-utils'
import { message } from 'ant-design-vue'
// pinia
import { createTestingPinia } from '@pinia/testing'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/store/user/user'

import UserProfile from '@/components/UserProfile.vue'

vi.mock('vue-router', vi.fn().mockReturnValue({
  useRouter: vi.fn(() => ({
    push: vi.fn(),
  })),
}))
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
  // @ts-expect-error: value exists
  useRouter.mockReturnValue({
    push: vi.fn(),
  })
  vi.useFakeTimers()

  let wrapper: VueWrapper
  beforeAll(() => {
    wrapper = mount(UserProfile, {
      global: {
        components: globalComponents,
        plugins: [
          createTestingPinia({ createSpy: vi.fn() }),
        ],
      },
      props: {
        user: {
          isLogin: false,
          userName: '',
        },
      },
    })
  })

  it('should render login button when login is false', async () => {
    const btnLogin = wrapper.get('.btn-login')
    expect(btnLogin.text()).toBe('登录')
    const spyMessage = vi.spyOn(message, 'success')
    const userStore = useUserStore()
    vi.spyOn(userStore, 'login')
    await btnLogin.trigger('click')
    expect(spyMessage).toHaveBeenCalled()
    expect(userStore.login).toHaveBeenCalled()
  })

  it('should render username when login is true', async () => {
    const userName = 'bobo'
    await wrapper.setProps({
      user: { isLogin: true, userName },
    })
    expect(wrapper.get('.user-profile-component').html()).toContain(userName)
    expect(wrapper.find('.user-profile-component').exists()).toBeTruthy()
  })

  it('should call logout and show message, call router.push after timeout', async () => {
    const userStore = useUserStore()
    vi.spyOn(userStore, 'logout')
    await wrapper.get('.user-profile-dropdown div').trigger('click')
    expect(userStore.logout).toHaveBeenCalled()
    vi.runAllTimers()
    expect(useRouter().push).toHaveBeenCalled()
  })
})
