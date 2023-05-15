import { AccessTokenDomain } from '@/domains/auth/access-token.domain'
import { envLambda } from '@/lambdas/get-env.lambda'
import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { NextFunction, Request, Response } from 'express'

// Creates wait time for n milliseconds to mock production
const PRIVATE_WAITING_MILLISECONDS = 500

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private readonly jwtService: JwtService) {}
  async use(req: Request, res: Response, next: NextFunction) {
    try {
      await AccessTokenDomain.fromReq(req, this.jwtService)
    } catch {
      const err = new UnauthorizedException()
      return res.status(err.getStatus()).send(err)
    }

    if (envLambda.mode.isProduct()) next()

    // This waiting logic is just to mock the db speed.
    await new Promise((resolve) =>
      setTimeout(resolve, PRIVATE_WAITING_MILLISECONDS),
    )

    next()
  }
}
