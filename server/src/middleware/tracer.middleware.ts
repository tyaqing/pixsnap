import * as rTracer from 'cls-rtracer'
import { randomString } from '@/utils/string'

export const rTracerMiddleware = rTracer.expressMiddleware({
  useHeader: true,
  headerName: 'X-Request-Id',
  echoHeader: true,
  requestIdFactory: () => randomString(32),
})
