import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { AccessTokenDomain } from '@/domains/auth/access-token.domain'
import { PreferenceDomain } from '@/domains/preference/preference.domain'
import { PreferenceModel, PreferenceProps } from '@/schemas/preference.schema'

@Injectable()
export class PreferenceService {
  constructor(
    @InjectModel(PreferenceProps.name)
    private preferenceModel: PreferenceModel,
  ) {}

  async get(atd: AccessTokenDomain): Promise<PreferenceDomain> {
    return PreferenceDomain.fromMdb(atd, this.preferenceModel)
  }
}
