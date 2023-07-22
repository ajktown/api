import { AccessTokenDomain } from '@/domains/auth/access-token.domain'
import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Observable, throwError } from 'rxjs'
import { catchError, tap } from 'rxjs/operators'

// TODO: Should use nest js defined logger to log instead for every console used here.
@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  constructor(private readonly jwtService: JwtService) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    const now = Date.now()
    const httpContext = context.switchToHttp()

    // url = i.e) /api/word
    // method = i.e) GET, POST, ...
    const req = httpContext.getRequest()
    const { url, method } = req

    // Get who has requested
    let rui: string = 'ajktown_defined_unidentified_user'
    try {
      const requestedUser = await AccessTokenDomain.fromReq(
        req,
        this.jwtService,
      )
      rui = requestedUser.userId
    } catch {}

    return next.handle().pipe(
      tap(() => {
        // Write a log message, only for any successful request.
        const ms: string = Date.now() - now + 'ms' // 14 (or 14ms)
        const message = `✅ [${rui}] [${method}] ${url} (${ms})`
        console.log(message)
      }),
      catchError((err) => {
        // Write a log message, only for any UNSUCCESSFUL request.
        const ms: string = Date.now() - now + 'ms' // 14 (or 14ms)
        const message = `❌ [${rui}] [${err.name}] [${method}] ${url} (${ms})`
        console.warn(message)
        return throwError(() => err)
      }),
    )
  }
}
