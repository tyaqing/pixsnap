import { Button, Center, HStack, StackDivider } from '@chakra-ui/react'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { FiGithub } from 'react-icons/fi'

import { I18nButton } from '@/components/I18nButton.tsx'
import { useGlobalStore } from '@/stores/useGlobalStore.ts'

export default function CopywriterFooter() {
  const store = useGlobalStore()
  const { i18n } = useTranslation()
  useEffect(() => {
    i18n.changeLanguage(store.lang)
  }, [store.lang])
  const schema = [
    {
      title: 'Github',
      leftIcon: <FiGithub />,
      onClick: () => {
        window.open('https://github.com/tyaqing/pixsnap')
      },
    },
  ]
  return (
    <Center>
      <HStack divider={<StackDivider />}>
        <I18nButton iconLeft={true} variant={'link'} />
        {schema.map((item) => (
          <Button
            key={item.title}
            variant={'link'}
            onClick={item?.onClick}
            leftIcon={item.leftIcon}
            size={'sm'}
          >
            {item.title}
          </Button>
        ))}
      </HStack>
    </Center>
  )
}
