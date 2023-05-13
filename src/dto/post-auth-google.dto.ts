import { IsString } from 'class-validator'

export class PostAuthGoogleBodyDTO {
  @IsString()
  clientId: string

  @IsString()
  credential: string
}
