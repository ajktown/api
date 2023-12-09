import { IsOptional } from 'class-validator'

/**
 * Order in a priority queue.
 * If both id and wordID given, id will be used.
 */
export class GetSharedResourcesQueryDTO {
  @IsOptional()
  id: string

  // TODO: Will also accept base64 encoded id?

  @IsOptional()
  wordId: string
}
