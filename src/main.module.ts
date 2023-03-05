import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common'
import { AppController } from '@/controllers/app.controller'
import { AppService } from '@/services/app.service'
import { WordModule } from './modules/word.module'
import { AuthMiddleware } from './middleware/auth.middleware'

@Module({
  imports: [WordModule],
  controllers: [AppController],
  providers: [AppService],
})
export class MainModule implements NestModule {
  public configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes('*')
  }
}
