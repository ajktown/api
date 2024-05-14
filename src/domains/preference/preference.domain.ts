import { AccessTokenDomain } from '../auth/access-token.domain'
import { IPreference } from './index.interface'
import {
  PreferenceDoc,
  PreferenceModel,
  PreferenceProps,
} from '@/schemas/preference.schema'
import { BadRequestError } from '@/errors/400/index.error'
import { GlobalLanguageCode } from '@/global.interface'
import { PatchPreferenceDto } from '@/dto/put-preference.dto'
import { DeleteForbiddenError } from '@/errors/403/action_forbidden_errors/delete-forbidden.error'
import { GetPreferenceRes } from '@/responses/get-preference.res'
import { DictPreferenceDomain } from './index.dict.domain'
import { UpdateForbiddenError } from '@/errors/403/action_forbidden_errors/update-forbidden.error'

export class PreferenceDomain {
  private readonly PRIVATE_MAX_RECENT_TAGS = 5
  private readonly props: Partial<IPreference>

  private constructor(props: Partial<IPreference>) {
    if (!props.dictPreference)
      props.dictPreference = DictPreferenceDomain.getDefault()

    this.props = props
    this.props.gptApiKey = this.props.gptApiKey ?? ``
  }

  get id() {
    return this.props.id
  }

  /**
   * returns user's preference domain.
   * If user doesn't have a preference, it creates a new one.
   */

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

    if (preferenceDocs.length > 1) {
      // TODO: Write a logger
      for await (const doc of preferenceDocs.slice(1)) {
        await PreferenceDomain.fromMdb(doc).delete(atd, model)
      }
    }

    if (!avoidRecursiveCall && preferenceDocs.length === 0) {
      const temp = new PreferenceDomain({
        id: atd.userId + 'temporary_preference_id',
        ownerId: atd.userId,
        nativeLanguages: [],
        recentTags: [],
        gptApiKey: ``,
      })

      await temp.toDoc(model).save()
      return this.fromMdbByAtd(atd, model, true)
    }

    return PreferenceDomain.fromMdb(preferenceDocs[0])
  }

  static fromMdb(doc: PreferenceDoc): PreferenceDomain {
    return new PreferenceDomain({
      id: doc.id,
      ownerId: doc.ownerID,
      nativeLanguages: doc.nativeLanguages as GlobalLanguageCode[],
      dictPreference: DictPreferenceDomain.fromDoc(doc),
      recentTags: doc.recentTags ?? ([] as string[]),
      gptApiKey: doc.gptApiKey ?? ``,
    })
  }

  toDoc(preferenceModel: PreferenceModel): PreferenceDoc {
    const preferenceProps: PreferenceProps = {
      ownerID: this.props.ownerId,
      nativeLanguages: this.props.nativeLanguages,
      selectedDictIds: this.props.dictPreference.selectedDictIds,
      recentTags: this.props.recentTags,
      gptApiKey: this.props.gptApiKey,
    }
    return new preferenceModel(preferenceProps)
  }

  toResDTO(): Partial<GetPreferenceRes> {
    return {
      ...this.props,
      dictPreference: this.props.dictPreference.toResDTO(),
    }
  }

  async updateWithPutDto(
    atd: AccessTokenDomain,
    dto: PatchPreferenceDto,
    model: PreferenceModel,
  ): Promise<PreferenceDomain> {
    // WARNING
    // Registration of GPT Key is only available to jkim67cloud@gmail.com, as it
    // charges users. AJK TOwn is not in a stage to take the responsibilities
    if (dto.gptApiKey && atd.email !== 'jkim67cloud@gmail.com')
      throw new UpdateForbiddenError(atd, `Preference.gptApiKey`)

    const nativeLanguages = dto.nativeLanguages ?? []
    const selectedDictIds = dto.selectedDictIds ?? []

    await model
      .findByIdAndUpdate(
        this.id,
        {
          // ownerId never changes
          nativeLanguages,
          selectedDictIds,
          gptApiKey: dto.gptApiKey,
        },
        { new: true },
      )
      .exec()
    return PreferenceDomain.fromMdbByAtd(atd, model)
  }

  async updateWithNewTags(
    atd: AccessTokenDomain,
    newTags: string[],
    model: PreferenceModel,
  ): Promise<PreferenceDomain> {
    const updatedRecentTags = Array.from(
      new Set([...newTags, ...this.props.recentTags]),
    ).slice(0, this.PRIVATE_MAX_RECENT_TAGS)

    // make sure it updates the db before modifying the domain data itself
    await model
      .findByIdAndUpdate(
        this.id,
        {
          recentTags: updatedRecentTags,
        },
        { new: true },
      )
      .exec()
    return PreferenceDomain.fromMdbByAtd(atd, model)
  }

  async delete(atd: AccessTokenDomain, model: PreferenceModel): Promise<void> {
    if (atd.userId !== this.props.ownerId) {
      throw new DeleteForbiddenError(atd, `Preference`)
    }

    await model.findByIdAndDelete(this.props.id).exec()
  }
}
