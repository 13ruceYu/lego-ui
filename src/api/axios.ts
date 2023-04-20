import type { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios'
import axios from 'axios'
import qs from 'qs'
import _ from 'lodash'
// import cookies from 'js-cookie'
// import { useUISettingStore } from '@/store/ui-setting/ui-setting'
import { useUserStore } from '@/store/user/user'
import router from '@/router'
import utils from '@/utils'

const userStore = useUserStore()
// const uiSettingStore = useUISettingStore()

/**
 * @description Log and display errors
 * @param {Error} error Error object
 */
function handleError(res: AxiosResponse<any, any>) {
  // Print to console
  if (import.meta.env.MODE === 'development') {
    utils.log.capsule('DolphinScheduler', 'UI')
    utils.log.error(res)
  }
  // window.$message.error(res.data.msg)
}

const baseRequestConfig: AxiosRequestConfig = {
  baseURL:
    import.meta.env.MODE === 'development'
      ? '/api'
      : `${import.meta.env.VITE_APP_PROD_WEB_URL}/api`,
  // timeout: uiSettingStore.getApiTimer ? uiSettingStore.getApiTimer : 20000,
  transformRequest: (params) => {
    if (_.isPlainObject(params)) {
      return qs.stringify(params, { arrayFormat: 'repeat' })
    } else {
      return params
    }
  },
  paramsSerializer: (params) => {
    return qs.stringify(params, { arrayFormat: 'repeat' })
  }
}

const service = axios.create(baseRequestConfig)

function err(err: AxiosError): Promise<AxiosError> {
  if (err.response?.status === 401 || err.response?.status === 504) {
    // userStore.setSessionId('')
    // userStore.setSecurityConfigType('')
    // userStore.setUserInfo({})
    router.push({ path: '/login' })
  }

  return Promise.reject(err)
}

service.interceptors.request.use((config) => {
  config.headers = config.headers || {}
  // config.headers.sessionId = userStore.getSessionId
  // const language = cookies.get('language')
  // if (language) config.headers.language = language

  return config
}, err)

// The response to intercept
service.interceptors.response.use((res: AxiosResponse) => {
  // No errno will be processed
  if (res.data.errno === undefined) {
    return res.data
  }

  switch (res.data.errno) {
    case 0:
      return res.data.data
    default:
      handleError(res)
      throw new Error('hello')
  }
}, err)

export { service as axios }
