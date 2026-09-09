import { apiClient } from './index'

export interface UploadResult {
  url: string
  filename: string
}

export const uploadApi = {
  // 上传图片
  uploadImage(file: File): Promise<UploadResult> {
    const formData = new FormData()
    formData.append('file', file)
    return apiClient.post('/blog/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
  },
}
