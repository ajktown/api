import { Injectable } from '@nestjs/common'
import { Request, Router } from 'express'

@Injectable()
export class AppService {
  getHome(req: Request) {
    const router = req.app._router as Router

    return {
      message: 'Welcome to AJK Town API Service!',
      websites: [
        'https://wordnote.ajktown.com',
        'https://consistency.ajktown.com',
      ],
      endpoints: router.stack
        .map((layer) => {
          if (layer.route) {
            // To make the output looks better, we padEnd the method name with spaces.
            // DELETE is the longest method name in standard HTTP methods.
            // "GET"    => "GET   "
            // "POST"   => "POST  "
            // "PUT"    => "PUT   "
            // "PATCH"  => "PATCH "
            // "DELETE" => "DELETE"
            const method = layer.route?.stack[0].method
              .toUpperCase()
              .padEnd(6, ' ')
            const path = layer.route?.path
            return `${method} ${path}`
          }
        })
        .filter((item) => item),
    }
  }
  getHello(): string {
    return 'Hello World from AJK Town API Service! Check out https://wordnote.ajktown.com'
  }

  getHealthz() {
    return {
      status: 'ok',
    }
  }
}
