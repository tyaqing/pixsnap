import i18next from 'i18next'
import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

import { useBucketStore } from '@/stores/useBucketStore.ts'
import { Bucket } from '@/types/entity.ts'
import { Format, PageType, PreviewUi } from '@/types/interface.ts'
import { LANG } from '@/utils/const.ts'
import { CustomStorage } from '@/utils/customStorage.ts'
import { isWeb } from '@/utils/env.ts'

export interface UploadInfo {
  name: string
  src: string
  originalSize: number
  size: number
  fileType: string
}
export interface IStore {
  setState: <T extends IStore>(payload: Partial<T>) => void
  pageType: PageType
  preview: PreviewUi[]
  loading: boolean
  url: string
  scale: number
  scaleList: number[]
  formatList: Format[]
  format: Format
  uploadHistory: UploadInfo[]
  destinationSheetVisible: boolean
  path: string
  selectedBucket?: Bucket
  lang: string
  localFile?: File
  accessToken: string
  changeBucket(bucketId: string): void
  changeLang(lang: string): void
  trialMode: boolean
}

export const useGlobalStore = create<IStore>()(
  persist(
    (set) => ({
      setState: (payload) => {
        set(payload)
      },
      pageType: PageType.LOADING,
      preview: [],
      loading: false,
      url: '',
      scale: 2,
      formatList: [Format.PNG],
      scaleList: [1, 2, 3],
      format: Format.PNG,
      uploadHistory: [],
      lang: import.meta.env.VITE_LANG || LANG.EN_US,
      path: '',
      trialMode: true,
      accessToken: '',
      destinationSheetVisible: false,
      changeBucket(bucketId: string) {
        const bucketStore = useBucketStore.getState()
        const find = bucketStore.bucketList.find((item) => item.bucket === bucketId)
        const pathList = find?.path || ''
        set({
          path: pathList[0] || '',
          selectedBucket: find,
        })
        bucketStore.setState({
          pathList: find?.path,
        })
      },
      changeLang(lang: string) {
        i18next.changeLanguage(lang)
        set({
          lang,
        })
      },
    }),
    {
      name: 'figmaConfig',
      storage: createJSONStorage(() => (isWeb() ? localStorage : CustomStorage)),
      partialize: (state) => ({
        scale: state.scale,
        format: state.format,
        path: state.path,
        uploadHistory: state.uploadHistory,
        lang: state.lang,
        selectedBucket: state.selectedBucket,
        url: state.url,
        accessToken: state.accessToken,
        trialMode: state.trialMode,
      }),
    },
  ),
)
