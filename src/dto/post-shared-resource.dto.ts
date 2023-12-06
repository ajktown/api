import { IsNumber, IsOptional, IsString } from 'class-validator'

export class PostSharedResourceDTO {
  /**
   * You may set up the expiring time.
   * If you want your shared resource to last for 24 hours,
   * set expireAfterSecs = 60 * 60 * 24 = 86,400.
   *
   * At this point it must expire
   */
  @IsOptional()
  @IsNumber()
  expireAfterSecs: number

  @IsOptional()
  @IsString()
  wordId: string
}
