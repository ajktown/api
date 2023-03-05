import { Controller, Get } from '@nestjs/common'
import { AppService } from '@/services/app.service'

const API_VERSION = 'v1'
@Controller(API_VERSION)
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello()
  }
}
