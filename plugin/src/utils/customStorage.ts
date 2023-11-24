import { StateStorage } from 'zustand/middleware'

import { storageGet, storageSet } from '@/utils/message.ts'

export const CustomStorage: StateStorage = {
  getItem(name: string): string | Promise<string | null> | null {
    return storageGet(name)
  },
  removeItem(name: string): void | Promise<void> {
    return storageSet(name, undefined)
  },
  setItem(name: string, value: string): void | Promise<void> {
    return storageSet(name, value)
  },
}
