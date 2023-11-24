import {
  AspectRatio,
  Box,
  Button,
  ButtonGroup,
  Heading,
  HStack,
  Icon,
  IconButton,
  Image,
  LinkOverlay,
  SimpleGrid,
  Spacer,
  Stack,
  Text,
  VStack,
} from '@chakra-ui/react'
import { inject } from '@vercel/analytics'
import { useTranslation } from 'react-i18next'
import { FaGithub, FaTwitter } from 'react-icons/fa'
import { FiFigma, FiPlay } from 'react-icons/fi'

import { AnimationBG } from '@/components/AnimationBG.tsx'
import { I18nButton } from '@/components/I18nButton.tsx'
import { CheckIcon } from '@/components/RadioCardGroup/RadioCardGroup.tsx'
import { isWeb } from '@/utils/env.ts'

import LogoPng from '../assets/logo.png'

inject()

export function WebWrapper({ children }: { children: React.ReactNode }) {
  const { t } = useTranslation()
  const features = [
    {
      id: '1',
      title: t('Open-source, customizable, MIT licensed'),
    },
    {
      id: '2',
      title: t('User-friendly: Figma Plugin and Web App'),
    },
    {
      id: '3',
      title: t('Compatible with various cloud storages'),
    },
    {
      id: '4',
      title: t('Auto image compression: mozjpeg, tinypng'),
    },
    {
      id: '5',
      title: t('Quick Docker deployment in minutes'),
    },
    {
      id: '6',
      title: t('Team-friendly: Easy permission configuration'),
    },
  ]
  if (isWeb()) {
    return (
      <VStack
        alignItems={'stretch'}
        w={'full'}
        h={'full'}
        gap={8}
        flex={1}
        className={'bg-gray-100'}
      >
        <AnimationBG />
        {/*头部*/}
        <HStack zIndex={10} bg={'white'} minH={'60px'} alignItems={'stretch'}>
          <HStack
            w={{
              base: '1280px',
            }}
            mx={'auto'}
          >
            <AspectRatio h={'32px'} w={'32px'} ratio={1}>
              <Image alt={'logo'} borderRadius={'full'} src={LogoPng} />
            </AspectRatio>
            <Text fontSize={'xl'} fontWeight={'bold'}>
              PixSnap.app
            </Text>
            <Spacer />
            <HStack>
              <I18nButton variant={'ghost'} />
            </HStack>
          </HStack>
        </HStack>
        {/*内容页面*/}
        <HStack
          overflow={'auto'}
          w={{
            base: 'full',
            xl: '1280px',
          }}
          mb={8}
          mx={'auto'}
          flex={1}
        >
          <VStack zIndex={1} pos={'relative'} minW={'800px'} flex={1}>
            <VStack
              align={'center'}
              alignItems={'stretch'}
              spacing={{ base: 8, md: 10 }}
              py={{ base: 20, md: 28 }}
              direction={{ base: 'column', md: 'row' }}
            >
              <Stack flex={1} spacing={{ base: 5, md: 10 }}>
                <Heading
                  lineHeight={1.1}
                  fontWeight={600}
                  fontFamily={''}
                  fontSize={{ base: '3xl', sm: '4xl', md: '5xl' }}
                >
                  <Text
                    as={'span'}
                    position={'relative'}
                    _after={{
                      content: "''",
                      width: 'full',
                      height: '30%',
                      position: 'absolute',
                      bottom: 1,
                      left: 0,
                      bg: 'red.300',
                      zIndex: -1,
                    }}
                  >
                    {t('Simplify Your')}
                  </Text>
                  <br />
                  <Text as={'span'} color={'red.400'}>
                    {t('image upload experience!')}
                  </Text>
                </Heading>
                <Text color={'gray.700'}>
                  {t(
                    'PixSnap is a robust image hosting tool that enables fast image uploads on the web and Figma. It automatically compresses images and integrates with popular object storage services like S3 and Cloudflare.',
                  )}
                </Text>
                <SimpleGrid columns={{ base: 1, xl: 2 }} spacing={1.5}>
                  {features.map((feature) => (
                    <HStack key={feature.id} align={'top'}>
                      <Box color={'green.400'} px={2}>
                        <Icon as={CheckIcon} />
                      </Box>
                      <VStack align={'start'}>
                        <Text fontWeight={600}>{feature.title}</Text>
                      </VStack>
                    </HStack>
                  ))}
                </SimpleGrid>
                <Stack spacing={{ base: 4, sm: 6 }} direction={{ base: 'column', sm: 'row' }}>
                  <Box pos={'relative'}>
                    <LinkOverlay
                      href={
                        'https://www.figma.com/community/plugin/1301958586584763919/pixsnap-upload-layer-to-s3-cloudflare'
                      }
                    >
                      <Button
                        size={'lg'}
                        fontWeight={'normal'}
                        px={6}
                        colorScheme={'cyan'}
                        leftIcon={<FiFigma w={4} h={4} />}
                      >
                        {t('Figma Plugin')}
                      </Button>
                    </LinkOverlay>
                  </Box>
                  <Box pos={'relative'}>
                    <LinkOverlay
                      target={'_blank'}
                      href={'https://github.com/tyaqing/pixsnap/TestToken.md'}
                    >
                      <Button
                        size={'lg'}
                        fontWeight={'normal'}
                        px={6}
                        colorScheme={'blue'}
                        leftIcon={<FiPlay w={4} h={4} />}
                      >
                        {t('Get Test Token')}
                      </Button>
                    </LinkOverlay>
                  </Box>
                </Stack>
              </Stack>
              <Stack spacing={{ base: '4', md: '5' }}>
                <Stack justify="space-between" direction="row" align="center">
                  {/*<Logo />*/}
                  <ButtonGroup variant="tertiary">
                    <IconButton
                      as="a"
                      href="https://github.com/tyaqing/pixsnap"
                      aria-label="GitHub"
                      icon={<FaGithub />}
                    />
                    <IconButton
                      as="a"
                      href="https://twitter.com/Edward00Funny"
                      aria-label="Twitter"
                      icon={<FaTwitter />}
                    />
                  </ButtonGroup>
                </Stack>
                <Text fontSize="sm" color="fg.subtle">
                  &copy; {new Date().getFullYear()} ABFree,made by Yaqing. All rights reserved.
                </Text>
              </Stack>
            </VStack>
          </VStack>
          <Spacer />
          <VStack h={'full'} overflow={'hidden'} borderRadius={'lg'} shadow={'xl'}>
            {children}
          </VStack>
        </HStack>
      </VStack>
    )
  }
  return children
}
