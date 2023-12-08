import { IsOptional } from 'class-validator'

export class GetSharedResourcesQueryDTO {
  @IsOptional()
  id: string

  // TODO: Will also accept base64 encoded id?

  @IsOptional()
  wordId: string
}
