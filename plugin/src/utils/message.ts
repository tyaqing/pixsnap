import { createStandaloneToast } from '@chakra-ui/react'

import { UiMessageType } from '@/types/interface.ts'
import { isWeb } from '@/utils/env.ts'

export function toast(message: string, isError = false) {
  if (isWeb()) {
    const { toast } = createStandaloneToast()
    toast({
      status: isError ? 'error' : 'success',
      title: message,
      duration: 1000,
      size: 'sm',
    })
    return
  }
  sendToSandBox(isError ? UiMessageType.ERROR : UiMessageType.MESSAGE, message)
}

export function sendToSandBox<T>(messageType: UiMessageType, data?: any): Promise<T> {
  const messageId = Math.random().toString(36).substr(2, 9)
  return new Promise((resolve) => {
    parent.postMessage(
      {
        pluginMessage: {
          type: messageType,
          data,
          messageId,
        },
      },
      '*',
    )
    const handlerMessage = (event: MessageEvent<any>) => {
      const { data, messageId: _messageId } = event.data.pluginMessage
      if (messageId === _messageId) {
        resolve(data)
        window.removeEventListener('message', handlerMessage)
      }
      // timeout 10s remove listener
      setTimeout(() => {
        window.removeEventListener('message', handlerMessage)
      }, 10000)
    }
    window.addEventListener('message', handlerMessage)
  })
}
export function storageGet(key: string): Promise<any> {
  return sendToSandBox(UiMessageType.STORAGE_GET, key)
}

export function storageSet(key: string, value: any) {
  sendToSandBox(UiMessageType.STORAGE_SET, { key, value })
  return Promise.resolve()
}
