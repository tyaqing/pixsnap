import './index.css'
import '@/axios.interceptors.ts'

import { ChakraProvider } from '@chakra-ui/react'
import ReactDOM from 'react-dom/client'

import { theme } from '@/theme.ts'

import App from './App.tsx'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <ChakraProvider theme={theme}>
    <App />
  </ChakraProvider>,
)
