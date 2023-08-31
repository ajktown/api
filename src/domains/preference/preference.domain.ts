import { AccessTokenDomain } from '../auth/access-token.domain'
import { IPreference } from './index.interface'
import {
  PreferenceDoc,
  PreferenceModel,
  PreferenceProps,
} from '@/schemas/preference.schema'
import { BadRequestError } from '@/errors/400/index.error'
import { GlobalLanguageCode } from '@/global.interface'
import { PutPreferenceDto } from '@/dto/put-preference.dto'

export class PreferenceDomain {
  private readonly props: Partial<IPreference>

  private constructor(props: Partial<IPreference>) {
    this.props = props
  }

  get id() {
    return this.props.id
  }

  toResDTO(): Partial<IPreference> {
    return this.props
  }

  static fromMdb(doc: PreferenceDoc): PreferenceDomain {
    return new PreferenceDomain({
      id: doc.id,
      ownerId: doc.ownerID,
      nativeLanguages: doc.nativeLanguages as GlobalLanguageCode[],
    })
  }

  static async fromMdbByAtd(
    atd: AccessTokenDomain,
    model: PreferenceModel,
    avoidRecursiveCall = false,
  ): Promise<PreferenceDomain> {
    const preferenceDocs = await model.find({ ownerID: atd.userId }).exec()
    if (avoidRecursiveCall && preferenceDocs.length !== 1) {
      throw new BadRequestError(
        'Something went really wrong while creating preference',
      )
    }

    if (preferenceDocs.length > 2)
      throw new BadRequestError(
        `We got ${preferenceDocs.length} preferenceDocs, when we expect 1 or 0`,
      )

    if (!avoidRecursiveCall && preferenceDocs.length === 0) {
      const temp = new PreferenceDomain({
        id: atd.userId + 'temporary_preference_id',
        ownerId: atd.userId,
        nativeLanguages: [],
      })

      await temp.toDocument(model).save()
      return this.fromMdbByAtd(atd, model, true)
    }

    return PreferenceDomain.fromMdb(preferenceDocs[0])
  }

  async updateWithPutDto(
    atd: AccessTokenDomain,
    dto: PutPreferenceDto,
    model: PreferenceModel,
  ): Promise<PreferenceDomain> {
    const nativeLanguages = dto.nativeLanguages ?? []

    await model
      .findByIdAndUpdate(
        this.id,
        {
          // ownerId never changes
          nativeLanguages,
        },
        { new: true },
      )
      .exec()
    return PreferenceDomain.fromMdbByAtd(atd, model)
  }

  toDocument(preferenceModel: PreferenceModel) {
    const preferenceProps: PreferenceProps = {
      ownerID: this.props.ownerId,
      nativeLanguages: this.props.nativeLanguages,
    }
    return new preferenceModel(preferenceProps)
  }
}
