import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

const bootstrap = async () => {
  const app = await NestFactory.create(AppModule)
  await app.listen(8000) // TODO: Use the env data
}
bootstrap();
