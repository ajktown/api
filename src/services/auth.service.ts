import { PostAuthGoogleBodyDTO } from '@/dto/post-auth-google.dto'
import { Injectable } from '@nestjs/common'
import { OAuth2Client } from 'google-auth-library'

@Injectable()
export class AuthService {
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
      console.log({
        payload,
      })
      // const userid = payload['sub']
      // If request specified a G Suite domain:
      // const domain = payload['hd'];
    } catch (error) {
      console.error(error)
    }
  }
}
