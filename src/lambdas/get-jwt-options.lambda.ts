import { envLambda } from './get-env.lambda'
import { JwtModuleOptions } from '@nestjs/jwt'

const PRIVATE_DEFAULT_EXPIRES_IN = `24h`

export const getJwtOptionsLambda = (): JwtModuleOptions => {
  return {
    global: true,
    secret: envLambda.getJwtTokenSecret(),
    signOptions: { expiresIn: PRIVATE_DEFAULT_EXPIRES_IN },
  }
}
