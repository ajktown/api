import { CookieConst } from '@/constants/cookie.const'
import { Response } from 'express'

export const getResWithRemovedHttpCookieLambda = (res: Response): Response => {
  // TODO: Should we raise an error, if the cookie is not found?

  res.clearCookie(CookieConst.AjktownSecuredAccessToken)
  return res
}
