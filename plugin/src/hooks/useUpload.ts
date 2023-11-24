import axios from 'axios'
import { Base64 } from 'js-base64'
import { useCallback, useMemo } from 'react'

import { UploadInfo, useGlobalStore } from '@/stores/useGlobalStore.ts'
import { HISTORY_NUM } from '@/utils/const.ts'
import { toast } from '@/utils/message.ts'

export function useUpload() {
  const store = useGlobalStore()
  const uploadFile = useCallback(
    async (file: File) => {
      const fd = new FormData()
      fd.append('file', file)
      fd.append('path', store.path || '')
      fd.append('bucket', store.selectedBucket?.bucket || '')
      const res = await axios<UploadInfo>({
        url: '/pixsnap/upload',
        method: 'POST',
        data: fd,
      }).finally(() => {
        store.setState({ loading: false })
      })
      const json = res.data
      const historyItem: UploadInfo = {
        fileType: json.fileType || 'png',
        originalSize: json.originalSize || 0,
        size: json.size || 0,
        name: json.name || '',
        src: json.src || '',
      }
      store.setState({ loading: false })
      toast('Upload Success')
      // only keep 10 history
      const uploadHistory = [historyItem, ...store.uploadHistory.slice(0, HISTORY_NUM - 1)]
      store.setState({ uploadHistory })
    },
    [
      store.preview,
      store.url,
      store.format,
      store.scale,
      store.uploadHistory,
      store.path,
      store.localFile,
    ],
  )
  const filenameHasOtherChar = useMemo(() => {
    if (!store.preview.length) return ''
    return !store.preview[0].name.match(/^[a-zA-Z0-9_-]+$/)
  }, [store.preview])
  const fileName = useMemo(() => {
    if (!store.preview.length) return ''
    // if filename include other than /a-zA-Z0-9_-/ will use base64(filename)
    if (filenameHasOtherChar) {
      return Base64.encode(store.preview[0].name) + '.' + store.format
    } else {
      return store.preview[0].name + '.' + store.format
    }
  }, [store.preview, store.format, filenameHasOtherChar])
  return {
    uploadFile,
    fileName,
    filenameHasOtherChar,
  }
}
