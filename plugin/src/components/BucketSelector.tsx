import { Button, HStack, Spacer, Text, VStack } from '@chakra-ui/react'
import { useTranslation } from 'react-i18next'

import { RadioCard, RadioCardGroup } from '@/components/RadioCardGroup/RadioCardGroup.tsx'
import { useGlobalStore } from '@/stores/useGlobalStore.ts'

export function BucketSelector() {
  const store = useGlobalStore()
  const { t } = useTranslation()
  return (
    <VStack px={4} minW={0} gap={1} alignItems={'stretch'}>
      <RadioCardGroup value={'bucket'}>
        <RadioCard
          defaultChecked={true}
          customRight={
            <Button
              variant={'ghost'}
              size={'xs'}
              onClick={() => {
                store.setState({
                  destinationSheetVisible: true,
                })
              }}
            >
              {t('Change')}
            </Button>
          }
          key={'bucket'}
          value={'bucket'}
        >
          <HStack w={'full'}>
            {store.selectedBucket?.bucket ? (
              <HStack minW={0}>
                <Text isTruncated color="emphasized" fontWeight="medium" fontSize="sm">
                  {store.selectedBucket?.bucket}
                </Text>
                {store.selectedBucket?.name && (
                  <Text isTruncated color="gray.500" fontWeight="medium" fontSize="sm">
                    ({store.selectedBucket?.name})
                  </Text>
                )}
              </HStack>
            ) : (
              <Text isTruncated color="emphasized" fontWeight="medium" fontSize="sm">
                {t('Please select a bucket')} 👉
              </Text>
            )}

            <Spacer />
          </HStack>
          <Text color="muted" fontSize="xs">
            Region: {store.selectedBucket?.region || '-'}
          </Text>
          <Text color="muted" fontSize="xs">
            Path: {store.path || '-'}
          </Text>
        </RadioCard>
      </RadioCardGroup>
    </VStack>
  )
}
