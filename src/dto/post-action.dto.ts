import { IsString } from 'class-validator'

export class PostActionDTO {
  @IsString()
  groupId: string
}
