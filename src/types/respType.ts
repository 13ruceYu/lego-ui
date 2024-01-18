export interface RespType<T = {}> {
  errno: number
  data: T
  message?: string
}
