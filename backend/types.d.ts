export type UploadedFile = {
  name: string
  type: string
  size: number
  data: Uint8Array
}

export type FileOrFiles = UploadedFile | UploadedFile[]
