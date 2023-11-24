import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { logger } from './common/winstonLogger'
import { rTracerMiddleware } from '@/middleware/tracer.middleware'
import { ValidationPipe } from '@nestjs/common'
import { checkConfig } from '@/utils/checkConfig'
const PORT = process.env.PORT || 9000

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger,
  })
  app.enableCors({
    origin: (origin, callback) => {
      callback(null, origin)
    },
    credentials: true,
  })
  app.useGlobalPipes(new ValidationPipe())
  app.use(rTracerMiddleware)
  app.setGlobalPrefix('pixsnap')
  await app.listen(9000)
}
checkConfig()

console.log('server http://localhost:' + PORT)

bootstrap()
