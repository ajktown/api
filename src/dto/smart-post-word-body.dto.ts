import { IsString } from 'class-validator'

export class SmartPostWordBodyDTO {
  @IsString()
  givenStr: string
}
