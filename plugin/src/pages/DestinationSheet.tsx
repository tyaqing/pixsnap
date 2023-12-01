import {
  Button,
  Center,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  FormControl,
  FormErrorMessage,
  FormLabel,
  HStack,
  IconButton,
  Input,
  Radio,
  RadioGroup,
  Spacer,
  Spinner,
  Stack,
  Tab,
  TabList,
  Tabs,
  Text,
  Textarea,
  VStack,
} from '@chakra-ui/react'
import { Field, Formik } from 'formik'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { FiX } from 'react-icons/fi'
import * as Yup from 'yup'

import { RadioCard, RadioCardGroup } from '@/components/RadioCardGroup/RadioCardGroup.tsx'
import { useBucketStore } from '@/stores/useBucketStore.ts'
import { useGlobalStore } from '@/stores/useGlobalStore.ts'
import { toast } from '@/utils/message.ts'

enum TabType {
  BUCKET = 0,
  PATH = 1,
  CONFIG = 2,
  COMPRESSION = 3,
}
interface NavHeadingProps {
  containerRef: React.RefObject<HTMLElement>
}
export default function DestinationSheet(props: NavHeadingProps) {
  const [tab, setTab] = useState<TabType>(TabType.BUCKET)
  const store = useGlobalStore()
  const { t } = useTranslation()
  return (
    <Drawer
      portalProps={{
        containerRef: props.containerRef,
      }}
      autoFocus={false}
      placement={'bottom'}
      isOpen={store.destinationSheetVisible}
      onClose={() => {
        store.setState({
          destinationSheetVisible: false,
        })
      }}
      closeOnOverlayClick={true}
    >
      <DrawerOverlay
        onClick={() => {
          store.setState({
            destinationSheetVisible: false,
          })
        }}
      />
      <DrawerContent
        className={'!absolute'}
        borderTopRadius={'xl'}
        containerProps={{
          onClick: () => {
            store.setState({
              destinationSheetVisible: false,
            })
          },
          w: 'full',
          h: 'full',
          position: 'absolute',
          overflow: 'hidden',
          top: 0,
          bottom: 0,
          left: 0,
          right: 0,
        }}
        maxH={'70vh'}
        h={'70vh'}
      >
        <DrawerHeader pt={4}>
          <VStack alignItems={'stretch'}>
            <HStack>
              <Text fontWeight={'semibold'}>{t('Destination')}</Text>
              <Spacer />
              <IconButton
                size={'xs'}
                colorScheme={'gray'}
                variant={'solid'}
                icon={<FiX />}
                aria-label={''}
                onClick={() => {
                  store.setState({
                    destinationSheetVisible: false,
                  })
                }}
              />
            </HStack>
            <Tabs
              defaultIndex={tab}
              onChange={(e) => {
                setTab(e as unknown as TabType)
              }}
              size={'sm'}
            >
              <TabList>
                <Tab>Bucket</Tab>
                <Tab>Path</Tab>
                <Tab>Config</Tab>
              </TabList>
            </Tabs>
          </VStack>
        </DrawerHeader>
        <DrawerBody>
          {tab === TabType.BUCKET && <BucketListTab />}
          {tab === TabType.PATH && <PathListTab />}
          {tab === TabType.CONFIG && <ConfigTab />}
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  )
}

function ConfigTab() {
  const globalStore = useGlobalStore()
  const { t } = useTranslation()
  const handleSubmit = (data: any) => {
    globalStore.setState({
      url: data.url,
      accessToken: data.accessToken,
    })
    toast(t('Saved'))
  }
  const initialValues = {
    url: globalStore.url,
    accessToken: globalStore.accessToken,
  }
  const validationSchema = Yup.object({
    url: Yup.string()
      .required('Required')
      .matches(/http(s)?:\/\/.+/, 'Invalid URL'),
    accessToken: Yup.string().required('Required'),
  })

  const toggleTrialMode = (setValues: any) => {
    let defaultValues = {
      url: 'https://demo.pixsnap.app',
      accessToken:
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJwaXhzbmFwIiwiY2xhaW1zIjp7ImFsbG93ZWQtYnVja2V0IjpbImNmLXIydGVzdCIsInRlc3QiXSwiYWxsb3dlZC1wYXRoIjpbInN0YXRpYyJdfSwidXNlciI6InBpeHNuYXAiLCJpYXQiOjE3MDA3OTM1MzQsImV4cCI6MTczMjMyOTUzNH0.xaxmjZIqIfvI0FgVpNcBjoZbjwPoTfSPRWsFKv4GIX8',
    }
    if (globalStore.trialMode) {
      defaultValues = {
        url: '',
        accessToken: '',
      }
    }
    globalStore.setState({
      trialMode: !globalStore.trialMode,
    })

    setValues(defaultValues)
    globalStore.setState(defaultValues)
  }
  return (
    <Formik
      validationSchema={validationSchema}
      initialValues={initialValues}
      onSubmit={handleSubmit}
    >
      {({ handleSubmit, errors, touched, setValues }) => (
        <Stack>
          {!globalStore.trialMode ? (
            <>
              <FormControl isRequired isInvalid={!!errors.url && touched.url}>
                <FormLabel htmlFor={'url'} fontSize={'sm'}>
                  URL
                </FormLabel>
                <Field as={Input} size={'sm'} name={'url'} id={'url'} />
                <FormErrorMessage>{errors.url}</FormErrorMessage>
              </FormControl>
              <FormControl isRequired isInvalid={!!errors.accessToken && touched.accessToken}>
                <FormLabel fontSize={'sm'} htmlFor={'accessToken'}>
                  AccessToken
                </FormLabel>
                <Field as={Textarea} rows={7} size={'sm'} name={'accessToken'} id={'accessToken'} />
                <FormErrorMessage>{errors.accessToken}</FormErrorMessage>
              </FormControl>
              <FormControl>
                <VStack>
                  <Button w={'full'} onClick={() => handleSubmit()} type={'submit'} size={'sm'}>
                    {t('Save')}
                  </Button>
                </VStack>
              </FormControl>
            </>
          ) : (
            <Center>
              <Text color={'gray'}>{t('Trial mode')}</Text>
            </Center>
          )}
          <Button
            w={'full'}
            onClick={() => toggleTrialMode(setValues)}
            size={'sm'}
            variant={'ghost'}
          >
            {globalStore.trialMode ? t('Exit trial mode') : t('Enter trial mode')}
          </Button>
        </Stack>
      )}
    </Formik>
  )
}

function BucketListTab() {
  const bucketStore = useBucketStore()
  const store = useGlobalStore()
  const { t } = useTranslation()
  return (
    <VStack alignItems={'stretch'}>
      <FormControl>
        {bucketStore.bucketList.length ? (
          <RadioCardGroup
            onChange={store.changeBucket}
            value={store.selectedBucket?.bucket}
            spacing="3"
          >
            {bucketStore.bucketListLoading && (
              <Center>
                <Spinner />
              </Center>
            )}
            {bucketStore.bucketList.map((bucket) => (
              <RadioCard key={bucket.bucket} value={bucket.bucket}>
                <HStack w={'full'}>
                  <HStack minW={0}>
                    <Text isTruncated color="emphasized" fontWeight="medium" fontSize="sm">
                      {bucket.bucket}
                    </Text>
                    <Text isTruncated color="gray.500" fontWeight="medium" fontSize="sm">
                      ({bucket.name})
                    </Text>
                  </HStack>
                  <Spacer />
                </HStack>
                <Text color="muted" fontSize="xs">
                  Region: {bucket.region} <br />
                  Bucket: {bucket.bucket} <br />
                </Text>
              </RadioCard>
            ))}
          </RadioCardGroup>
        ) : (
          <Text fontSize={'sm'} color={'gray.500'}>
            {t('Please configure the bucket first')}
          </Text>
        )}
      </FormControl>
    </VStack>
  )
}

function PathListTab() {
  const store = useGlobalStore()
  const bucketStore = useBucketStore()
  const { t } = useTranslation()
  return (
    <FormControl>
      {/*<FormLabel fontSize={'sm'}>Path</FormLabel>*/}
      {bucketStore.pathList.length ? (
        <RadioGroup
          onChange={(e) =>
            store.setState({
              path: e,
            })
          }
          value={store.path}
        >
          <Stack direction="column">
            {bucketStore.pathList.map((item, index) => (
              <Radio colorScheme={'cyan'} key={index} size={'sm'} value={item}>
                {item}
              </Radio>
            ))}
          </Stack>
        </RadioGroup>
      ) : (
        <Text fontSize={'sm'} color={'gray.500'}>
          {t('Please configure the bucket first')}
        </Text>
      )}
    </FormControl>
  )
}
