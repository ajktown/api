import { AccessTokenDomain } from '@/domains/auth/access-token.domain'
import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { NextFunction, Request, Response } from 'express'

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

    next()
  }
}
