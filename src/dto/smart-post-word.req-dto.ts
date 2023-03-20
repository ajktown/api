import { IsString } from 'class-validator'

export class SmartPostWordReqDTO {
  @IsString()
  givenStr: string
}
