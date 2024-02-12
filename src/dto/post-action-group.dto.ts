import { IsString } from 'class-validator'

export class PostActionGroupDTO {
  @IsString()
  name: string
}
