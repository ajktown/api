import { NestFactory } from '@nestjs/core'
import { MainModule } from './main.module'

const GLOBAL_PREFIX = "/api"
const LISTENING_PORT= 8000 // TODO: Use the env data

const bootstrap = async () => {
  const app = await NestFactory.create(MainModule)

  app.setGlobalPrefix(GLOBAL_PREFIX)
  app.enableCors()

  await app.listen(LISTENING_PORT)
}
bootstrap()
