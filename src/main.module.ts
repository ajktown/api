import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common'
import { AppController } from '@/controllers/app.controller'
import { AppService } from '@/services/app.service'
import { WordModule } from './modules/word.module'
import { AuthMiddleware } from './middleware/auth.middleware'
import { MongooseModule } from '@nestjs/mongoose'
import { getMdbUriLambda } from './lambdas/get-mdb-uri.lambda'
import { SmartWordModule } from './modules/smart-word.module'
import { SemesterModule } from './modules/semester.module'
import { AuthModule } from './modules/auth.module'

@Module({
  imports: [
    AuthModule,
    WordModule,
    SemesterModule,
    SmartWordModule,
    MongooseModule.forRoot(getMdbUriLambda()),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class MainModule implements NestModule {
  public configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes('*')
  }
}
