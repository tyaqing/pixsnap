import {
  AspectRatio,
  Card,
  HStack,
  IconButton,
  Image,
  LinkOverlay,
  Spinner,
  Tag,
  Text,
  VStack,
} from '@chakra-ui/react'
import { copyToClipboard } from 'figx'
import { FiChevronsDown, FiClipboard } from 'react-icons/fi'

import { UploadInfo } from '@/stores/useGlobalStore.ts'
import { bytesToSize } from '@/utils/biz.ts'
import { toast } from '@/utils/message.ts'

export default function UploadCard(props: UploadInfo) {
  const onCopy = () => {
    copyToClipboard(props.src)
    toast('Copied to clipboard')
  }
  const mimeType = (props?.fileType || 'png').toUpperCase()
  const tagColor = () => {
    switch (mimeType) {
      case 'PNG':
        return 'pink.500'
      case 'JPG':
        return 'teal.500'
      case 'SVG':
        return 'purple.500'
    }
  }
  return (
    <Card shadow={'xs'} rounded={'6px'} p={2}>
      <HStack>
        <AspectRatio
          rounded={'4px'}
          border={'1px'}
          bg={'blackAlpha.50'}
          borderColor={'blackAlpha.100'}
          w={'52px'}
          ratio={1}
        >
          <LinkOverlay role={'group'} as={'a'} target={'_blank'} href={props.src}>
            <Image
              p={1}
              aria-labelledby={'image'}
              fallback={
                <Text fontSize={'sm'} as={'span'}>
                  <Spinner color={'gray.500'} />
                </Text>
              }
              objectFit="cover"
              src={props.src}
            />
          </LinkOverlay>
        </AspectRatio>

        <VStack rowGap={1} minW={'0'} alignItems={'stretch'} flex={1}>
          <HStack gap={0}>
            <Text
              style={{
                direction: 'rtl',
              }}
              isTruncated
              fontSize={'sm'}
            >
              {props.name?.slice(0, -4)}
            </Text>
            <Text fontSize={'xs'} as={'span'} color={tagColor()}>
              ·{mimeType}
            </Text>
          </HStack>
          <HStack fontFamily={'mono'}>
            <Text fontSize={'xs'}>{bytesToSize(props.size)}</Text>
            {mimeType !== 'SVG' && (
              <Text color={'blackAlpha.500'} className={'line-through'} fontSize={'xs'}>
                {bytesToSize(props.originalSize)}
              </Text>
            )}
            {mimeType !== 'SVG' && (
              <Tag colorScheme={'twitter'} variant={'subtle'} fontWeight={'bold'} size={'sm'}>
                <FiChevronsDown /> {100 - Math.floor((props.size / props.originalSize) * 100)}%
              </Tag>
            )}
          </HStack>
        </VStack>
        <IconButton
          aria-label="Search database"
          icon={<FiClipboard />}
          variant={'ghost'}
          onClick={onCopy}
          size={'xs'}
        />
      </HStack>
    </Card>
  )
}
