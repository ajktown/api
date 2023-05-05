import { UserDomain } from '@/domains/user/user.domain'
import { PostAuthGoogleBodyDTO } from '@/dto/post-auth-google.dto'
import { Injectable, Req } from '@nestjs/common'
import { OAuth2Client } from 'google-auth-library'
import { JwtService } from '@nestjs/jwt'
import { PostOauthRes } from '@/responses/post-auth-oauth.res'
import { GetWhoAmIRes } from '@/responses/get-who-am-i.res'
import { CookieConst } from '@/constants/cookie.const'
import { OauthPayloadDomain } from '@/domains/auth/oauth-payload.domain'
import {
  DeprecatedUserDocument,
  DeprecatedUserSchemaProps,
} from '@/schemas/deprecated-user.schema'
import { Model } from 'mongoose'
import { InjectModel } from '@nestjs/mongoose'
import { AccessTokenDomain } from '@/domains/auth/access-token.domain'

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    @InjectModel(DeprecatedUserSchemaProps.name)
    private deprecatedUserModel: Model<DeprecatedUserDocument>,
  ) {}

  /** Get words by given query */
  async byGoogle(query: PostAuthGoogleBodyDTO): Promise<PostOauthRes> {
    try {
      const ticket = await new OAuth2Client(query.clientId).verifyIdToken({
        idToken: query.credential,
        audience: query.clientId,
      })

      const oauthPayload = OauthPayloadDomain.fromPayload(ticket.getPayload())

      const doc = await this.deprecatedUserModel
        .find({
          // TODO: toFind() implement for OauthPayload
          email: oauthPayload.email,
        })
        .limit(1)
        .exec()

      if (doc.length !== 1)
        throw new Error("The returned data should be 1. But it's not.")

      return AccessTokenDomain.fromUser(
        UserDomain.fromMdb(doc[0]),
      ).toAccessToken(this.jwtService)
    } catch (error) {
      throw new Error('Invalid Credential')
    }
  }

  // TODO: Make a domain or something. Or something else like middleware. Anyway do it.
  // {
  //   _ga: 'GA1.1.1247656588.1679370113',
  //   _ga_DXJEH1ZRXX: 'GS1.1.1679370113.1.1.1679370178.0.0.0',
  //   ASAT: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmZWRlcmFsSUQiOiIxMTYzNTUzNjM0MjA4NzcwNDc4NTQiLCJlbWFpbCI6ImpraW02N2Nsb3VkQGdtYWlsLmNvbSIsImdpdmVuTmFtZSI6Ikplb25nd29vIiwiZmFtaWx5TmFtZSI6IktpbSIsImlhdCI6MTY4MjgxNTgxNywiZXhwIjoxNjgyOTAyMjE3fQ.HtC-2U5WFOQtlwQjfH2yru8olamJanI95RN_MpHkrww',
  //   g_state: '{"i_l":1,"i_p":1682823021710}'
  // }

  private notSignedIn(): GetWhoAmIRes {
    return {
      isSignedIn: false,
    }
  }
  async getWhoAmi(@Req() req: Request): Promise<GetWhoAmIRes> {
    const potentialToken = req['cookies'][CookieConst.AjktownSecuredAccessToken]
    if (typeof potentialToken !== 'string' || !potentialToken)
      return this.notSignedIn()

    // TODO: Should be handled by the
    try {
      await this.jwtService.verify(potentialToken)
    } catch {
      return this.notSignedIn()
    }

    return {
      isSignedIn: true,
      detailedInfo: {
        id: 'abc',
      },
    }
  }
}
