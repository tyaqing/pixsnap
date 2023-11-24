import axios from 'axios'
import { create } from 'zustand'

import { useGlobalStore } from '@/stores/useGlobalStore.ts'
import { Bucket } from '@/types/entity.ts'
import { toast } from '@/utils/message.js'

interface BucketStore {
  bucketList: Bucket[]
  bucketListLoading: boolean
  pathList: string[]
  getBucketList: () => Promise<void>
  setState: <T extends BucketStore>(payload: Partial<T>) => void
}
export const useBucketStore = create<BucketStore>((set) => ({
  bucketList: [],
  bucketListLoading: true,
  pathList: [],
  setState: (payload) => {
    set(payload)
  },
  getBucketList: async () => {
    set({
      bucketListLoading: true,
    })
    const globalStore = useGlobalStore.getState()
    const bucketList: Bucket[] = (await axios.get('/pixsnap/bucket')).data
    set({
      bucketListLoading: false,
    })
    if (!bucketList || bucketList?.length === 0) {
      toast('No bucket found in response, please check your webhook', true)
      return
    }

    const findBucket =
      bucketList.find((item) => item.bucket === globalStore.selectedBucket?.bucket) || bucketList[0]
    set({
      bucketList,
      pathList: findBucket.path,
    })
    globalStore.setState({
      selectedBucket: findBucket,
    })
    if (findBucket.path.length === 0) {
      toast('No path found in response, please check your webhook', true)
      return
    }
    const findPath = findBucket.path.find((item) => item === globalStore.path) || findBucket.path[0]
    globalStore.setState({
      path: findPath,
    })
  },
}))
