import {
  As,
  Center,
  HStack,
  Icon,
  Link,
  LinkProps,
  Spacer,
  Spinner,
  Text,
  useColorModeValue,
  VStack,
} from '@chakra-ui/react'
import { FiArrowUpRight } from 'react-icons/fi'

import CopywriterFooter from '@/components/CopywriterFooter.tsx'
import Header from '@/components/Header.tsx'
import UploadHistory from '@/components/UploadHistory.tsx'
import { UploadPreview } from '@/components/UploadPreview.tsx'
import { useGlobalStore } from '@/stores/useGlobalStore.ts'
import { PageType } from '@/types/interface.ts'

const App = () => {
  const store = useGlobalStore()

  if (store.pageType === PageType.LOADING) {
    return (
      <Center w={'100%'} h={'100%'}>
        <Spinner />
      </Center>
    )
  }
  return (
    <VStack
      w={'full'}
      h={'100%'}
      mt={206}
      pt={4}
      pb={4}
      overflowY={'scroll'}
      alignItems={'stretch'}
    >
      <Header />
      <UploadPreview />
      <UploadHistory />
      <Spacer />
      <CopywriterFooter />
    </VStack>
  )
}

interface NavLinkProps extends LinkProps {
  icon: As
}
export const NavLink = (props: NavLinkProps) => {
  const { icon, ...linkProps } = props
  return (
    <Link
      px="2"
      py="1.5"
      borderRadius="md"
      _hover={{ bg: useColorModeValue('gray.100', 'gray.700') }}
      _activeLink={{
        bg: 'gray.700',
        color: 'white',
      }}
      {...linkProps}
    >
      <HStack justify="space-between">
        <HStack spacing="3">
          <Icon as={icon} />
          <Text as="span" fontSize="sm" lineHeight="1.25rem">
            {props.children}
          </Text>
        </HStack>
        {props.isExternal && (
          <Icon as={FiArrowUpRight} boxSize="4" color={useColorModeValue('gray.600', 'gray.400')} />
        )}
      </HStack>
    </Link>
  )
}

export default App
