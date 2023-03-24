import { NestFactory } from '@nestjs/core'
import { envLambda, SupportedEnvAttr } from './lambdas/get-env.lambda'
import { MainModule } from './main.module'

const PRIVATE_GLOBAL_PREFIX = '/api'
const PRIVATE_DEFAULT_LISTENING_PORT = 8000

const bootstrap = async () => {
  const app = await NestFactory.create(MainModule)

  app.setGlobalPrefix(PRIVATE_GLOBAL_PREFIX)
  app.enableCors() // TODO: Does it enable too many Requesting Origins?

  const port = envLambda.get(
    SupportedEnvAttr.ListeningPort,
    PRIVATE_DEFAULT_LISTENING_PORT,
  )
  await app.listen(port)
}
bootstrap()
