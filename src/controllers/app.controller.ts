import { Controller, Get } from '@nestjs/common'
import { AppService } from '@/services/app.service'

export enum ApiHomePath {
  // Unlike other api paths with mandatory /api prefix, this is the only one that doesn't have it.
  // Checkout src/main.ts for more details.
  Home = ``,
  HomeHelloWorld = `hello-world`,
}
@Controller()
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
