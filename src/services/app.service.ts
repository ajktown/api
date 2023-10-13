import { Injectable } from '@nestjs/common'

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World from AJK Town API Service! Check out https://wordnote.ajktown.com'
  }

  getHealthz() {
    return {
      status: 'ok',
    }
  }
}
