import { AccessTokenDomain } from '@/domains/auth/access-token.domain'
import { UnidentifiedUserError } from '@/errors/401/unidentified-user.error'
import { envLambda } from '@/lambdas/get-env.lambda'
import { Injectable, Logger, NestMiddleware } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { NextFunction, Request, Response } from 'express'

// TODO: When certain request has arrived & has only half of the access token period,
// We should refresh the access token
@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(
    private readonly logger: Logger,
    private readonly jwtService: JwtService,
  ) {}
  async use(req: Request, res: Response, next: NextFunction) {
    // mimic latency in real api
    if (envLambda.mode.isLocal())
      await new Promise((resolve) => setTimeout(resolve, 200))

    try {
      await AccessTokenDomain.fromReq(req, this.jwtService)
    } catch (err) {
      this.logger.error(err)

      return res.status(err.getStatus()).send(new UnidentifiedUserError())
    }

    next()
  }
}
