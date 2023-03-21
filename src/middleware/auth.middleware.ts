import {
  getEnvLambda,
  StrictlyEnv,
  SupportedEnvAttr,
} from '@/lambdas/get-env.lambda'
import { Injectable, NestMiddleware } from '@nestjs/common'
import { NextFunction, Request, Response } from 'express'

// Creates wait time for n milliseconds to mock production
const PRIVATE_WAITING_MILLISECONDS = 500

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  async use(req: Request, res: Response, next: NextFunction) {
    // TODO! This entire thing is NOT working as the class name. Delete them all when test complete
    // TODO: Temporary, wait for 1 second
    // TODO: Apply access control for token, in a standard Nest JS Way with validator
    if (
      getEnvLambda(SupportedEnvAttr.StrictlyEnv) === StrictlyEnv.ProductMode
    ) {
      next()
    }

    await new Promise((resolve) =>
      setTimeout(resolve, PRIVATE_WAITING_MILLISECONDS),
    )

    next()
  }
}
