import { IsBoolean, IsOptional } from 'class-validator'

export class GetSharedResourcesQueryDTO {
  /** If undefined, it returns both. If true, returns expired ones only. If false, returns non-expired ones only. */
  @IsBoolean()
  @IsOptional()
  isExpired: boolean
}
