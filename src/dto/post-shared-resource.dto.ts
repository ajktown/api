import { IsNumber, IsOptional, IsString, Max } from 'class-validator'

/**
 * MAXIMUM_EXPIRE_AFTER_SECS defines the maximum number of seconds.
 * AJK Town API does not allow infinite expiration time.
 */
// const MAXIMUM_EXPIRE_AFTER_SECS = 60 * 60 * 24 * 7 // 7 days
const MAXIMUM_EXPIRE_AFTER_SECS = 60 // 60 seconds

export class PostSharedResourceDTO {
  /**
   * You may set up the expiring time.
   * If you want your shared resource to last for 24 hours,
   * set expireAfterSecs = 60 * 60 * 24 = 86,400.
   *
   * At this point it must expire
   */
  @IsNumber()
  @Max(MAXIMUM_EXPIRE_AFTER_SECS)
  expireAfterSecs: number

  @IsOptional()
  @IsString()
  wordId: string
}
