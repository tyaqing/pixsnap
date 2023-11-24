import '@/i18n.ts'

import { useBreakpointValue, VStack } from '@chakra-ui/react'
import { lazy, useEffect, useRef } from 'react'

import Index from '@/pages/Index.tsx'
import { WebWrapper } from '@/pages/WebWarpper.tsx'
import { useBucketStore } from '@/stores/useBucketStore.ts'
import { useGlobalStore } from '@/stores/useGlobalStore.ts'
import { PageType, PluginMessageType, Preview, PreviewUi } from '@/types/interface.ts'
import { toBase64 } from '@/utils/base64.ts'

const DestinationSheet = lazy(() => import('@/pages/DestinationSheet.tsx'))
export default function App() {
  const containerRef = useRef<HTMLDivElement>(null)
  const store = useGlobalStore()
  const bucketStore = useBucketStore()

  useEffect(() => {
    if (store.accessToken && store.url) {
      bucketStore.getBucketList()
    }
  }, [store.accessToken, store.url])

  useEffect(() => {
    setTimeout(() => {
      store.setState({
        pageType: PageType.LOADED,
      })
    }, 200)
    window.addEventListener('message', onMessage)
    return () => {
      window.removeEventListener('message', onMessage)
    }
  }, [])
  const onMessage = (event: MessageEvent<any>) => {
    if (event.data.pluginMessage) {
      const { type, data } = event.data.pluginMessage
      if (type === PluginMessageType.PREVIEW) {
        const tmpPreview: PreviewUi[] = data.map((preview: Preview) => {
          return {
            ...preview,
            base64: toBase64(preview.buffer),
          }
        })
        store.setState({
          preview: tmpPreview,
        })
      }
    }
  }

  return (
    <WebWrapper>
      <VStack
        ref={containerRef}
        w={{
          sm: 'full',
          md: 340 + 'px',
        }}
        m={useBreakpointValue({
          sm: 0,
          md: '0 auto',
        })}
        overflow={'hidden'}
        bg={'gray.50'}
        h={'full'}
        gap={0}
        pos={'relative'}
      >
        <Index />
        <DestinationSheet containerRef={containerRef} />
      </VStack>
    </WebWrapper>
  )
}
