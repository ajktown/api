import { AccessTokenDomain } from '../auth/access-token.domain'
import { IPreference } from './index.interface'
import { PreferenceModel, PreferenceProps } from '@/schemas/preference.schema'
import { BadRequestError } from '@/errors/400/index.error'
import { GlobalLanguageCode } from '@/global.interface'

export class PreferenceDomain {
  private readonly props: Partial<IPreference>

  private constructor(props: Partial<IPreference>) {
    this.props = props
  }

  toResDTO(): Partial<IPreference> {
    return this.props
  }

  static async fromMdb(
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
      return this.fromMdb(atd, model, true)
    }

    return new PreferenceDomain({
      id: preferenceDocs[0].id,
      ownerId: preferenceDocs[0].ownerID,
      nativeLanguages: preferenceDocs[0]
        .nativeLanguages as GlobalLanguageCode[],
    })
  }

  toDocument(preferenceModel: PreferenceModel) {
    const preferenceProps: PreferenceProps = {
      ownerID: this.props.ownerId,
      nativeLanguages: this.props.nativeLanguages,
    }
    return new preferenceModel(preferenceProps)
  }
}
