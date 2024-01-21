import { Controller, Get, Req } from '@nestjs/common'
import { AppService } from '@/services/app.service'
import { Request } from 'express'

export enum ApiHomePath {
  // Unlike other api paths with mandatory /api prefix, this is the only one that doesn't have it.
  // Checkout src/main.ts for more details.
  Home = ``,
  Healthz = `healthz`,
  HomeHelloWorld = `hello-world`,
}
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get(ApiHomePath.Home)
  home(@Req() req: Request) {
    return this.appService.getHome(req)
  }

  @Get(ApiHomePath.Healthz)
  healthz() {
    return this.appService.getHealthz()
  }

  @Get(ApiHomePath.HomeHelloWorld)
  getHello(): string {
    return this.appService.getHello()
  }
}
