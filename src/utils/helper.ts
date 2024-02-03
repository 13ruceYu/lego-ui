import { message } from 'ant-design-vue'
import html2canvas from 'html2canvas'
import { uploadImage } from '@/api/modules/utils'

interface CheckCondition {
  format?: string[]
  // 使用多少 M 为单位
  size?: number
}
type ErrorType = 'size' | 'format' | null
export function beforeUploadCheck(file: File, condition: CheckCondition) {
  const { format, size } = condition
  const isValidFormat = format ? format.includes(file.type) : true
  const isValidSize = size ? (file.size / 1024 / 1024 < size) : true
  let error: ErrorType = null
  if (!isValidFormat)
    error = 'format'

  if (!isValidSize)
    error = 'size'

  return {
    passed: isValidFormat && isValidSize,
    error,
  }
}

export function commonUploadCheck(file: File) {
  const result = beforeUploadCheck(file, { format: ['image/jpeg', 'image/png'], size: 1 })
  const { passed, error } = result
  if (error === 'format')
    message.error('上传图片只能是 JPG/PNG 格式!')

  if (error === 'size')
    message.error('上传图片大小不能超过 1Mb')

  return passed
}

export function getImageDimensions(url: string | File) {
  return new Promise<{ width: number; height: number }>((resolve, reject) => {
    const img = new Image()
    img.src = typeof url === 'string' ? url : URL.createObjectURL(url)
    img.addEventListener('load', () => {
      const { naturalWidth: width, naturalHeight: height } = img
      resolve({ width, height })
    })
    img.addEventListener('error', () => {
      reject(new Error('There was some problem with the image.'))
    })
  })
}

export function getParentElement(element: HTMLElement, className: string) {
  while (element) {
    if (element.classList && element.classList.contains(className))
      return element
    else
      element = element.parentNode as HTMLElement
  }
  return null
}

export function insertAt(arr: any[], index: number, newItem: any) {
  return [
    ...arr.slice(0, index),
    newItem,
    ...arr.slice(index),
  ]
}

export async function uploadFile(file: Blob, fileName = 'default.png') {
  const newFile = file instanceof File ? file : new File([file], fileName)
  const formData = new FormData()
  formData.append(newFile.name, newFile)
  const urls = await uploadImage(formData)
  return urls
}

function getCanvasBlob(canvas: HTMLCanvasElement) {
  return new Promise<Blob | null>((resolve) => {
    canvas.toBlob((blob) => {
      resolve(blob)
    })
  })
}

export async function takeScreenshotAndUpload(el: HTMLElement) {
  const canvas = await html2canvas(el, { width: 375, useCORS: true, scale: 1 })
  const canvasBlob = await getCanvasBlob(canvas)
  if (canvasBlob) {
    const data = await uploadFile(canvasBlob)
    return data
  }
}
