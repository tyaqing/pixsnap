import * as winston from 'winston'
import { createLogger } from 'winston'
import { WinstonModule } from 'nest-winston'
import * as rTracer from 'cls-rtracer'

const format = winston.format.combine(
  winston.format.timestamp(),
  winston.format.ms(),
  winston.format.json(),
)
export const winstonLogger = createLogger({
  level: 'info',
  format,
  defaultMeta: {
    get requestId() {
      const rId = rTracer.id()
      if (typeof rId === 'string') return rId.replace(/-/g, '')
      return rId
    },
  },
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(format),
    }),
  ],
})
if (process.env.WRITE_LOG === 'true') {
  winstonLogger.add(
    new winston.transports.File({
      filename: `logs/upload.log`,
    }),
  )
}

export const logger = WinstonModule.createLogger({
  instance: winstonLogger,
})
