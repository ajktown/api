import { NestFactory } from '@nestjs/core'
import { envLambda, SupportedEnvAttr } from './lambdas/get-env.lambda'
import { MainModule } from './main.module'
import * as cookieParser from 'cookie-parser'
import { ApiHomePath } from './controllers/app.controller'
import { ValidationPipe } from '@nestjs/common'

const PRIVATE_GLOBAL_PREFIX = '/api'
const PRIVATE_GLOBAL_PREFIX_EXCLUDE = [
  ApiHomePath.Home,
  ApiHomePath.Healthz,
  ApiHomePath.HomeHelloWorld,
]
const PRIVATE_DEFAULT_LISTENING_PORT = 8000

const bootstrap = async () => {
  const app = await NestFactory.create(MainModule)

  app.setGlobalPrefix(PRIVATE_GLOBAL_PREFIX, {
    exclude: PRIVATE_GLOBAL_PREFIX_EXCLUDE,
  })

  app.enableCors({
    origin: envLambda.getCorsOrigin(),
    credentials: true,
  })

  app.use(cookieParser())
  app.useGlobalPipes(new ValidationPipe({ transform: true }))

  const port = envLambda.get(
    SupportedEnvAttr.ListeningPort,
    PRIVATE_DEFAULT_LISTENING_PORT,
  )
  await app.listen(port)
}
bootstrap()
