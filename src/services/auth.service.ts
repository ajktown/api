import { UserDomain } from '@/domains/user/user.domain'
import { PostAuthGoogleBodyDTO } from '@/dto/post-auth-google.dto'
import { Injectable, Req } from '@nestjs/common'
import { OAuth2Client } from 'google-auth-library'
import { JwtService } from '@nestjs/jwt'
import { PostOauthRes } from '@/responses/post-auth-oauth.res'
import { GetWhoAmIRes } from '@/responses/get-who-am-i.res'
import { CookieConst } from '@/constants/cookie.const'

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  private async signJwt(user: UserDomain): Promise<PostOauthRes> {
    // TODO: Implement later
    return {
      accessToken: await this.jwtService.signAsync(user.toResDTO()),
    }
  }
  /** Get words by given query */
  async byGoogle(query: PostAuthGoogleBodyDTO): Promise<PostOauthRes> {
    const client = new OAuth2Client(query.clientId)
    try {
      const ticket = await client.verifyIdToken({
        idToken: query.credential,
        audience: query.clientId, // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
      })
      const payload = ticket.getPayload()
      const user = UserDomain.fromGoogleAuthPayload(payload)
      // const userid = payload['sub']
      // If request specified a G Suite domain:
      // const domain = payload['hd'];

      return this.signJwt(user)
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
    if (typeof potentialToken !== 'string' || !potentialToken) return this.notSignedIn()

    // TODO: Should be handled by the 
    try {
      await this.jwtService.verify(potentialToken)
    } catch {
      return this.notSignedIn()
    }

    return {
      isSignedIn: true,
      detailedInfo: {
        id: "abc"
      }
    }
  }
}
