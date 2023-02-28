import { Module } from '@nestjs/common'
import { AppController } from '@/controllers/app.controller'
import { AppService } from '@/services/app.service'
import { WordModule } from './modules/word.module'

@Module({
  imports: [
    WordModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class MainModule {}
