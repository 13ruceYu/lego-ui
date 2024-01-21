import { describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
// pinia
import { createPinia, setActivePinia } from 'pinia'
import { useRouter } from 'vue-router'
import { nextTick } from 'vue'
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

  setActivePinia(createPinia())
  const userStore = useUserStore()
  const wrapper = mount(UserProfile, {
    global: {
      components: globalComponents,
    },
  })

  it('should render login button when login is false', async () => {
    const btnLogin = wrapper.get('.btn-login')
    expect(btnLogin.text()).toBe('登录')
  })

  it('should render username when login is true', async () => {
    const username = 'bobo'
    // userStore.$patch({ isLogin: true, data: { username } })
    userStore.$patch({ isLogin: true, data: { username } })
    await nextTick()
    expect(wrapper.get('.user-profile-component').html()).toContain(username)
    expect(wrapper.find('.user-profile-component').exists()).toBeTruthy()
  })

  it('should call logout and show message, call router.push after timeout', async () => {
    vi.spyOn(userStore, 'logout')
    expect(wrapper.find('.user-profile-dropdown div').exists()).toBeTruthy()
    await wrapper.get('.user-profile-dropdown div').trigger('click')
    expect(userStore.logout).toHaveBeenCalled()
    vi.runAllTimers()
    expect(useRouter().push).toHaveBeenCalled()
  })
})
