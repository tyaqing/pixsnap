import {
  Button,
  HStack,
  Icon,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Spacer,
  Text,
} from '@chakra-ui/react'
import { FiCheck, FiGlobe } from 'react-icons/fi'

import { useGlobalStore } from '@/stores/useGlobalStore.ts'
import { LANG_LIST } from '@/utils/const.ts'

interface I18nButtonProps {
  variant: 'ghost' | 'link'
  iconLeft?: boolean
}
export function I18nButton(props: I18nButtonProps) {
  const globalStore = useGlobalStore()
  return (
    <Menu placement={'bottom-end'}>
      <MenuButton
        as={Button}
        size={'sm'}
        variant={props.variant}
        leftIcon={props.iconLeft ? <FiGlobe /> : undefined}
        rightIcon={!props.iconLeft ? <FiGlobe /> : undefined}
      >
        {LANG_LIST.find((lang) => lang.key === globalStore.lang)?.shortName}
      </MenuButton>
      <MenuList>
        {LANG_LIST.map((lang) => (
          <MenuItem
            w={'full'}
            display={'block'}
            onClick={() => globalStore.changeLang(lang.key)}
            key={lang.key}
          >
            <HStack>
              <Text>{lang.name}</Text>
              <Spacer />
              {globalStore.lang === lang.key && <Icon as={FiCheck} />}
            </HStack>
          </MenuItem>
        ))}
      </MenuList>
    </Menu>
  )
}
