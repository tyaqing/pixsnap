import { Button } from '@chakra-ui/react'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { FiCloud } from 'react-icons/fi'

import { useUpload } from '@/hooks/useUpload.ts'
import { useGlobalStore } from '@/stores/useGlobalStore.ts'
import { ExportDefault, UiMessageType } from '@/types/interface.ts'
import { uploadPreCheck } from '@/utils/biz.ts'
import { sendToSandBox, toast } from '@/utils/message.ts'

export default function UploadButton() {
  const { uploadFile, fileName } = useUpload()
  const store = useGlobalStore()
  const previewNames = useMemo(() => {
    return store.preview.map((pre) => pre.name)
  }, [store.preview])
  const { t } = useTranslation()
  const onUpload = async () => {
    if (!uploadPreCheck(store.preview, previewNames)) return
    // check bucket、path
    if (!store.selectedBucket || !store.path) {
      toast('Please set bucket and path first.', true)
      return
    }
    store.setState({ loading: true })
    let file: File
    if (store.localFile) {
      file = store.localFile
    } else {
      const exports = await sendToSandBox<ExportDefault[]>(UiMessageType.UPLOAD, {
        preview: store.preview,
        format: store.format,
        scale: store.scale,
      })
      if (exports.length < 0) {
        toast('exports.length < 0', true)
        return
      }
      file = new File([exports[0].buffer], fileName, {
        type: `image/${exports[0].format}`,
      })
    }

    await uploadFile(file)
    if (store.localFile) {
      store.setState({
        localFile: undefined,
        preview: [],
      })
    }
  }

  return (
    <Button
      w={'full'}
      isLoading={store.loading}
      size={'xs'}
      leftIcon={<FiCloud />}
      onClick={onUpload}
    >
      {t('Upload')}
    </Button>
  )
}
