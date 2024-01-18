import { defineStore } from 'pinia'

interface GlobalProps {
  requestNumber: number
  opNames: { [key: string]: boolean }
}

export const useGlobalStore = defineStore({
  id: 'global',
  state: (): GlobalProps => ({
    requestNumber: 0,
    opNames: {},
  }),
  getters: {
    isLoading: state => state.requestNumber > 0,
    isOpLoading: state => (opName: string) => state.opNames[opName],
  },
  actions: {
    startLoading(opName?: string) {
      this.requestNumber++
      if (opName)
        this.opNames[opName] = true
    },
    finishLoading(opName?: string) {
      this.requestNumber--
      opName && delete this.opNames[opName]
    },
  },
})
