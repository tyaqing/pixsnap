import i18next from 'i18next'

import { PreviewUi } from '@/types/interface.ts'
import { isWeb } from '@/utils/env.ts'
import { toast } from '@/utils/message.ts'

export function uploadPreCheck(preview: PreviewUi[], previewNames: string[]) {
  if (preview.length == 0) {
    if (isWeb()) {
      toast(i18next.t('Select Image'), true)
    } else {
      toast(i18next.t('Select Layer'), true)
    }
    return false
  }
  if (preview.filter((pre) => pre.name == '').length > 0) {
    toast('Empty image file name', true)
    return false
  }
  if (previewNames.length != new Set(previewNames).size) {
    toast('Duplicate image file name', true)
    return false
  }
  return true
}

export function bytesToSize(bytes: number) {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  // @ts-ignore
  return parseFloat((bytes / Math.pow(k, i)).toFixed(0)) + '' + sizes[i]
}
