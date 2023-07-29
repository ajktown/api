import { Logger, MiddlewareConsumer, Module, NestModule } from '@nestjs/common'
import { AppController } from '@/controllers/app.controller'
import { AppService } from '@/services/app.service'
import { WordModule } from './modules/word.module'
import { AuthMiddleware } from './middleware/auth.middleware'
import { MongooseModule } from '@nestjs/mongoose'
import { getMdbUriLambda } from './lambdas/get-mdb-uri.lambda'
import { SemesterModule } from './modules/semester.module'
import { AuthModule } from './modules/auth.module'
import { JwtModule } from '@nestjs/jwt'
import { getJwtOptionsLambda } from './lambdas/get-jwt-options.lambda'
import { authMdlExcludedPaths } from './constants/auth-mdl-excluded-paths.const'
import { APP_INTERCEPTOR } from '@nestjs/core'
import { LoggingInterceptor } from './interceptors/logging.interceptor'

@Module({
  imports: [
    AuthModule,
    WordModule,
    SemesterModule,
    MongooseModule.forRoot(getMdbUriLambda()),
    JwtModule.register(getJwtOptionsLambda()),
  ],
  controllers: [AppController],
  providers: [
    Logger,
    AppService,
    {
      // Apply logger to every controller for every request
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
  ],
})
export class MainModule implements NestModule {
  public configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .exclude(...authMdlExcludedPaths)
      .forRoutes('*')
  }
}
