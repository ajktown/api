import { IsString } from 'class-validator'

export class PostActionDTO {
  @IsString()
  groupId: string

  @IsString()
  message: string
}
