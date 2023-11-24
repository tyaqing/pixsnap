import {
  Box,
  Button,
  Divider,
  HStack,
  Input,
  Popover,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  Radio,
  RadioGroup,
  Spacer,
  Text,
  VStack,
} from '@chakra-ui/react'
import { useTranslation } from 'react-i18next'

import { RadioCard, RadioCardGroup } from '@/components/RadioCardGroup/RadioCardGroup.tsx'
import UploadButton from '@/components/UploadButton.tsx'
import { useGlobalStore } from '@/stores/useGlobalStore.ts'
import { Format } from '@/types/interface.ts'
import { FORMAT_LIST, SCALE_LIST } from '@/utils/const.ts'
import { isWeb } from '@/utils/env.ts'

export default function Header() {
  const store = useGlobalStore()
  const { t } = useTranslation()
  const onScaleChange = (scale: number) => {
    store.setState({
      scale: scale,
    })
  }
  const onNameChange = (name: string) => {
    if (!store.preview.length) return
    const itemCopy = [...store.preview]
    itemCopy[0].name = name
    store.setState({
      preview: itemCopy,
    })
  }
  return (
    <VStack gap={0} pos={'absolute'} top={0} w={'full'} bg={'white'} zIndex={'1'}>
      {!isWeb() && <Divider m={0} p={0} />}
      <VStack w={'full'} alignItems={'stretch'}>
        <HStack w={'full'} alignItems={'center'} pt={2} px={4}>
          <Input
            autoFocus={false}
            variant={'filled'}
            flex={1}
            size={'sm'}
            type="text"
            onChange={(e) => onNameChange(e.target.value)}
            value={store.preview?.[0]?.name}
            placeholder={t('File Name')}
          />
          <Popover
            size={'sm'}
            strategy={'fixed'}
            placement={'bottom-end'}
            closeOnBlur
            isLazy
            lazyBehavior="keepMounted"
          >
            <PopoverTrigger>
              <Input
                textAlign={'center'}
                readOnly
                fontFamily={'mono'}
                variant={'filled'}
                w={'54px'}
                value={store.format.toUpperCase()}
                size={'sm'}
              />
            </PopoverTrigger>
            <PopoverContent borderRadius={'6px'} w={'200px'}>
              <PopoverBody>
                <RadioGroup
                  value={store.format}
                  onChange={(format) =>
                    store.setState({
                      format: format as Format,
                    })
                  }
                >
                  <HStack flexWrap={'wrap'}>
                    {FORMAT_LIST.map((item, index) => (
                      <Radio value={item.value} key={index} size={'sm'}>
                        {item.name}
                      </Radio>
                    ))}
                  </HStack>
                </RadioGroup>
              </PopoverBody>
            </PopoverContent>
          </Popover>
          {!isWeb() && (
            <Popover
              strategy={'fixed'}
              placement={'bottom-end'}
              closeOnBlur
              isLazy
              lazyBehavior="keepMounted"
            >
              <PopoverTrigger>
                <Input
                  textAlign={'center'}
                  type={'number'}
                  variant={'filled'}
                  isDisabled={store.format === Format.SVG}
                  w={'45px'}
                  value={store.scale}
                  onClick={(e) => {
                    // @ts-ignore
                    e.target.select()
                  }}
                  onChange={(e) => {
                    const scale = Number(e.target.value)
                    if (!scale) {
                      onScaleChange(0.5)
                      return
                    }
                    onScaleChange(scale)
                  }}
                  size={'sm'}
                />
              </PopoverTrigger>
              <PopoverContent borderRadius={'6px'} w={'220px'}>
                <PopoverBody>
                  <RadioGroup
                    value={String(store.scale)}
                    onChange={(scale) =>
                      store.setState({
                        scale: Number(scale),
                      })
                    }
                  >
                    <HStack flexWrap={'wrap'}>
                      {SCALE_LIST.map((item, index) => (
                        <Radio value={String(item)} key={index} size={'sm'}>
                          x{item}
                        </Radio>
                      ))}
                    </HStack>
                  </RadioGroup>
                </PopoverBody>
              </PopoverContent>
            </Popover>
          )}
        </HStack>
        <Divider />
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
        <Divider />
        <HStack px={4} alignItems={'stretch'}>
          <Box flex={1}>
            <UploadButton />
          </Box>
        </HStack>
        <Divider m={0} p={0} />
      </VStack>
    </VStack>
  )
}
