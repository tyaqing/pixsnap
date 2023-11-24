import {
  AspectRatio,
  Button,
  Center,
  HStack,
  Icon,
  IconButton,
  Square,
  Text,
  useColorModeValue,
  VStack,
} from '@chakra-ui/react'
import { useDropzone } from 'react-dropzone'
import { useTranslation } from 'react-i18next'
import { FiUploadCloud, FiXCircle } from 'react-icons/fi'

import { useGlobalStore } from '@/stores/useGlobalStore.ts'
import { toBase64 } from '@/utils/base64.ts'
import { isWeb } from '@/utils/env.ts'
import { toast } from '@/utils/message.ts'

export function UploadPreview() {
  const { getRootProps, getInputProps } = useDropzone({
    onDrop: async (acceptedFiles) => {
      if (acceptedFiles.length === 0) return
      const preview = acceptedFiles.map(async (file) => {
        const uint8Array = new Uint8Array(await file.arrayBuffer())
        return {
          id: file.name,
          name: file.name,
          base64: toBase64(uint8Array),
        }
      })
      store.setState({
        preview: await Promise.all(preview),
        localFile: acceptedFiles[0],
      })
    },
    onDropRejected: (fileRejections) => {
      fileRejections.forEach((fileRejection) => {
        fileRejection.errors.forEach((err) => {
          toast(err.message, true)
        })
      })
    },
    onError: (err) => {
      console.log('err', err)
    },
    // only accept image png, jpg, svg
    accept: {
      'image/png': [],
      'image/jpeg': [],
      'image/jpg': [],
      'image/svg+xml': [],
    },
    // only accept one file
    multiple: false,
  })

  const store = useGlobalStore()
  const { t } = useTranslation()

  return (
    <VStack px={4} alignItems={'stretch'}>
      <AspectRatio ratio={16 / 9}>
        <Center
          w={'full'}
          h={'full'}
          pos={'relative'}
          className="overflow-hidden rounded-[4px]"
          borderWidth="1px"
          borderRadius="lg"
          px="2"
          py="2"
          bg={useColorModeValue('blackAlpha.50', 'gray.800')}
          {...getRootProps()}
          role={'group'}
        >
          <input {...getInputProps()} />
          {store.preview.map((pre, index) => (
            <img
              key={index}
              className={'max-h-full'}
              src={`data:image/png;base64,${pre.base64}`}
              alt=""
            />
          ))}
          {store.preview.length === 0 && (
            <VStack spacing="3">
              <Square size="10" bg="bg-subtle" borderRadius="lg">
                <Icon as={FiUploadCloud} boxSize="5" color="muted" />
              </Square>
              <VStack spacing="1">
                <HStack spacing="1" whiteSpace="nowrap">
                  <Text fontSize="sm" color="muted">
                    {isWeb() ? t('Drop your file here,') : t('Please select a layer,')}
                  </Text>
                  <Button variant="link" colorScheme="blue" size="sm">
                    {t('or Browse')}
                  </Button>
                </HStack>
                <Text fontSize="xs" color="blackAlpha.600">
                  {t('PNG, JPG or SVG up to 5MB')}
                </Text>
              </VStack>
            </VStack>
          )}
          {store.preview.length > 0 && (
            <IconButton
              icon={<FiXCircle />}
              onClick={(e) => {
                e.stopPropagation()
                store.setState({
                  preview: [],
                  localFile: undefined,
                })
              }}
              rounded={'full'}
              size={'xs'}
              colorScheme={'blackAlpha'}
              pos={'absolute'}
              top={2}
              right={2}
              aria-label={''}
            />
          )}
        </Center>
      </AspectRatio>
    </VStack>
  )
}
