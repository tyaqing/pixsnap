import { BucketConfig } from '@/utils/checkConfig'

export function mineType2format(mineType: string) {
  switch (mineType) {
    case 'image/png':
      return 'png'
    case 'image/jpg':
    case 'image/jpeg':
      return 'jpg'
    case 'image/svg+xml':
    case 'image/svg':
      return 'svg'
    default:
      return 'png'
  }
}

export function generateUrl(fileName: string, s3Config: BucketConfig, path: string): string {
  const { cdnUrl, bucket, endpoint } = s3Config
  const filePath = '/' + path + '/' + fileName
  const regionUrl = 'https://' + bucket + '.' + endpoint

  if (cdnUrl) return cdnUrl + filePath
  else return regionUrl + filePath
}
