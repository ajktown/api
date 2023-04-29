import { UserDomain } from '@/domains/user/user.domain'
import { PostAuthGoogleBodyDTO } from '@/dto/post-auth-google.dto'
import { Injectable } from '@nestjs/common'
import { OAuth2Client } from 'google-auth-library'
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
  ){}

  private async signJwt (user: UserDomain) {
    // TODO: Implement later
    return {
      accessToken: await this.jwtService.signAsync(user.toResDTO())
    }
  }
  /** Get words by given query */
  async byGoogle(query: PostAuthGoogleBodyDTO) {
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
      console.log(await this.signJwt(user))
      // const userid = payload['sub']
      // If request specified a G Suite domain:
      // const domain = payload['hd'];
    } catch (error) {
      console.error(error)
    }
  }
}
