import { UserDomain } from '@/domains/user/user.domain'
import { PostAuthGoogleBodyDTO } from '@/dto/post-auth-google.dto'
import { Injectable, Req } from '@nestjs/common'
import { OAuth2Client } from 'google-auth-library'
import { JwtService } from '@nestjs/jwt'
import { PostOauthRes } from '@/responses/post-auth-oauth.res'
import { GetAuthPrepRes as GetAuthPrepRes } from '@/responses/get-who-am-i.res'
import { OauthPayloadDomain } from '@/domains/auth/oauth-payload.domain'
import {
  DeprecatedUserDocument,
  DeprecatedUserSchemaProps,
} from '@/schemas/deprecated-user.schema'
import { Model } from 'mongoose'
import { InjectModel } from '@nestjs/mongoose'
import { AccessTokenDomain } from '@/domains/auth/access-token.domain'
import { Request } from 'express'

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

      const oauthPayload = OauthPayloadDomain.fromGooglePayload(
        ticket.getPayload(),
      )

      const doc = await this.deprecatedUserModel
        .find(oauthPayload.toFind())
        .limit(1)
        .exec()

      if (doc.length !== 1)
        throw new Error(
          `Length of the returned data should be 1, but we got "${doc.length}"`,
        )

      return AccessTokenDomain.fromUser(
        UserDomain.fromMdb(doc[0]),
      ).toAccessToken(this.jwtService)
    } catch (error) {
      throw new Error('Invalid Credential')
    }
  }

  /** Attaches HttpOnly Token for dev-user */
  async byDevToken(): Promise<PostOauthRes> {
    return AccessTokenDomain.fromUser(
      UserDomain.underDevEnv(),
    ).toAccessToken(this.jwtService)
  }

  async getAuthPrep(req: Request): Promise<GetAuthPrepRes> {
    try {
      const atd = await AccessTokenDomain.fromReq(req, this.jwtService)
      return {
        isSignedIn: true,
        detailedInfo: atd.toDetailedInfo(),
      }
    } catch {
      return {
        isSignedIn: false,
      }
    }
  }
}
