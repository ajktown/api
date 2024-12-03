import { IsOptional } from 'class-validator'

export class PatchUserDTO {
  @IsOptional()
  nickname: string
}
