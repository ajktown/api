import { Injectable, NestMiddleware } from '@nestjs/common'
import { NextFunction, Request, Response } from 'express'

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  async use(req: Request, res: Response, next: NextFunction) {
    // TODO: Temporary, wait for 1 second
    await new Promise((resolve) => setTimeout(resolve, 1000))

    next()
  }
}
