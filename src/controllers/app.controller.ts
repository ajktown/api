import { Controller, Get } from '@nestjs/common'
import { AppService } from '@/services/app.service'
import { AjkTownApiVersion } from './index.interface'
@Controller(AjkTownApiVersion.V1)
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello()
  }
}
