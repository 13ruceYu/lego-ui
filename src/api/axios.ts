import type { AxiosRequestConfig, AxiosResponse } from 'axios'
import axios from 'axios'
import { useGlobalStore } from '@/store/global/global'
import utils from '@/utils'
import type { RespType } from '@/types/respType'

let globalStore: any

/**
 * @description Log and display errors
 * @param {Error} error Error object
 */
function handleError(res: AxiosResponse) {
  window.$message.error(res.data.message)
  // Print to console
  if (import.meta.env.MODE === 'development') {
    utils.log.capsule('DolphinScheduler', 'UI')
    utils.log.error(res)
  }
}

const baseRequestConfig: AxiosRequestConfig = {
  baseURL:
    import.meta.env.MODE === 'development'
      ? '/api'
      : `${import.meta.env.VITE_APP_BASE_URL}/api`,
  timeout: 20000,
  // TODO: when post or put data include array, below code will transform to object, why?
  // transformRequest: (params) => {
  //   if (_.isPlainObject(params))
  //     return qs.stringify(params, { arrayFormat: 'repeat' })
  //   else
  //     return params
  // },
  // paramsSerializer: (params) => {
  //   return qs.stringify(params, { arrayFormat: 'repeat' })
  // },
}

const service = axios.create(baseRequestConfig)

service.interceptors.request.use((config) => {
  globalStore = useGlobalStore()
  config.headers = config.headers || {}
  globalStore.startLoading()

  return config
})

// The response to intercept
service.interceptors.response.use((res: AxiosResponse) => {
  globalStore.finishLoading()
  const { data } = res
  const { errno } = data as RespType
  if (errno !== 0) {
    handleError(res)
    return Promise.reject(data)
  }
  return data.data
}, (err) => {
  globalStore.finishLoading()
  return Promise.reject(err)
})

export { service as axios }
