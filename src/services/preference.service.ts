import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { AccessTokenDomain } from '@/domains/auth/access-token.domain'
import { PreferenceDomain } from '@/domains/preference/preference.domain'
import { PreferenceModel, PreferenceProps } from '@/schemas/preference.schema'
import { PatchPreferenceDto } from '@/dto/put-preference.dto'

@Injectable()
export class PreferenceService {
  constructor(
    @InjectModel(PreferenceProps.name)
    private preferenceModel: PreferenceModel,
  ) {}

  async get(atd: AccessTokenDomain): Promise<PreferenceDomain> {
    return PreferenceDomain.fromMdbByAtd(atd, this.preferenceModel)
  }

  async patch(
    atd: AccessTokenDomain,
    dto: PatchPreferenceDto,
  ): Promise<PreferenceDomain> {
    const domain = await PreferenceDomain.fromMdbByAtd(
      atd,
      this.preferenceModel,
    )
    return domain.updateWithPutDto(atd, dto, this.preferenceModel)
  }
}
