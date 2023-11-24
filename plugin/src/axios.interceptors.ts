import axios from 'axios'

import { useGlobalStore } from '@/stores/useGlobalStore.ts'
import { toast } from '@/utils/message.ts'
axios.defaults.timeout = 0
axios.interceptors.request.use((config) => {
  const { accessToken, url } = useGlobalStore.getState()
  config.baseURL = url
  // add jwt to header
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`
  }
  return config
})

axios.interceptors.response.use(
  (response) => {
    if (response.status === 200 || response.status === 201) {
      return response
    } else {
      throw new Error(`Error with response, status code: ${response.status}`)
    }
  },
  (error) => {
    if (error.response) {
      // The request was made and the server responded with a status code
      const { data } = error.response
      console.log('data: ', data)
      if (Array.isArray(data.message) && data.message.length > 0) {
        toast('HTTP Response:' + data.message[0], true)
      } else if (typeof data.message === 'string') {
        toast('HTTP Response:' + data.message, true)
      } else {
        toast('Service Error', true)
      }
      if (data.statusCode === 401) {
        console.log('401')
      }
    } else if (error.request) {
      // The request was made but no response was received
      console.log('request: ', error.request)
      toast('Request Error ,Please check your url or accessToken', true)
    } else {
      // Something happened in setting up the request that triggered an Error
      toast('Other Error', true)
      console.log('Error: ', error.message, error.response, error.request)
    }
    return Promise.reject(error)
  },
)
