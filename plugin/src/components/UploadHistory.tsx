import { Box, Button, Center, HStack, Spacer, Text, Tooltip, VStack } from '@chakra-ui/react'
import { useTranslation } from 'react-i18next'
import { FiBox, FiInfo } from 'react-icons/fi'

import UploadCard from '@/components/UploadCard.tsx'
import { useGlobalStore } from '@/stores/useGlobalStore.ts'
import { HISTORY_NUM } from '@/utils/const.ts'

export default function UploadHistory() {
  const store = useGlobalStore()
  const { t } = useTranslation()
  return (
    <>
      <HStack px={4} alignItems={'center'}>
        <Spacer />
        <Text color={'gray.600'} fontSize={'xs'} fontWeight={'bold'}>
          {t('Upload Record')} {store.uploadHistory.length ? `(${store.uploadHistory.length})` : ''}
        </Text>
        <Tooltip placement={'bottom'} label={`Only save ${HISTORY_NUM} local records.`}>
          <Box color={'gray.600'} fontSize={'sm'}>
            <FiInfo />
          </Box>
        </Tooltip>
        <Spacer />
      </HStack>
      <VStack px={4} alignItems={'stretch'}>
        {store.uploadHistory.length === 0 && (
          <Center minH={'100px'}>
            <HStack>
              <FiBox />
              <Text color={'gray.600'} fontSize={'xs'} fontWeight={'bold'}>
                {t('No Record')}
              </Text>
            </HStack>
          </Center>
        )}
        {store.uploadHistory.map((uploadInfo) => (
          <UploadCard key={uploadInfo.name} {...uploadInfo} />
        ))}
        {store.uploadHistory.length > 0 && (
          <Button
            size={'xs'}
            colorScheme={'red'}
            variant={'ghost'}
            onClick={() => {
              store.setState({
                uploadHistory: [],
              })
            }}
          >
            {t('Clear History')}
          </Button>
        )}
      </VStack>
    </>
  )
}
