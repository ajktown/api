import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common'
import { Observable } from 'rxjs'
import { tap } from 'rxjs/operators'

// TODO: This only catches the successful error. We need to catch the error as well.
// TODO: It would be also cool to have userId in the log.
@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const now = Date.now()
    const httpContext = context.switchToHttp()

    // url = i.e) /api/word
    // method = i.e) GET, POST, ...
    const { url, method } = httpContext.getRequest()

    return next.handle().pipe(
      tap(() => {
        const ms: string = Date.now() - now + 'ms' // 14 (or 14ms)
        const message = `✓ [${method}] ${url} (${ms})`
        console.log(message)
      }),
    )
  }
}
