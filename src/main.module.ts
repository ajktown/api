import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common'
import { AppController } from '@/controllers/app.controller'
import { AppService } from '@/services/app.service'
import { WordModule } from './modules/word.module'
import { AuthMiddleware } from './middleware/auth.middleware'
import { MongooseModule } from '@nestjs/mongoose'

// TODO: Move this to env or something else.
const MONGO_DB_ROOT_URI =
  'mongodb://root:local_root_71aae4225232353a9736957210416f22d8571c@0.0.0.0:55302/'

@Module({
  imports: [WordModule, MongooseModule.forRoot(MONGO_DB_ROOT_URI)],
  controllers: [AppController],
  providers: [AppService],
})
export class MainModule implements NestModule {
  public configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes('*')
  }
}
