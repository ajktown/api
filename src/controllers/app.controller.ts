import { Controller, Get } from '@nestjs/common'
import { AppService } from '@/services/app.service'
import { AjkTownApiVersion } from './index.interface'

enum ApiHomePath {
  Home = ``,
  HomeHelloWorld = `hello-world`,
}
@Controller(AjkTownApiVersion.V1)
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get(ApiHomePath.Home)
  home(): string {
    return this.appService.getHello()
  }

  @Get(ApiHomePath.HomeHelloWorld)
  getHello(): string {
    return this.appService.getHello()
  }
}
