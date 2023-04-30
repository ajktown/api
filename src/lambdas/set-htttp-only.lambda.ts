import { CookieConst } from '@/constants/cookie.const'
import { PostOauthRes } from '@/responses/post-auth-oauth.res'
import { Response } from 'express'

const PRIVATE_DEFAULT_ACCESS_TOKEN_EXPIRES_IN = 1000 * 60 * 60 * 24 // 1 day

export const setHttpOnlyCookieLambda = (
  res: Response,
  data: PostOauthRes,
): Response => {
  res.cookie(CookieConst.AjktownSecuredAccessToken, data.accessToken, {
    httpOnly: true,
    maxAge: PRIVATE_DEFAULT_ACCESS_TOKEN_EXPIRES_IN,
    sameSite: 'strict',
  })
  return res
}
