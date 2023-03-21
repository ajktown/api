import { Injectable, NestMiddleware } from '@nestjs/common'
import { NextFunction, Request, Response } from 'express'

// Creates wait time for n milliseconds to mock production
// TODO: This should happen only for the ENV !== "prod"
const PRIVATE_WAITING_MILLISECONDS = 500

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  async use(req: Request, res: Response, next: NextFunction) {
    // TODO: Temporary, wait for 1 second
    // TODO: Apply access control for token, in a standard Nest JS Way with validator
    await new Promise((resolve) => setTimeout(resolve, PRIVATE_WAITING_MILLISECONDS))

    next()
  }
}
