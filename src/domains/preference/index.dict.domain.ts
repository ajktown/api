import { availableDictCodes } from '@/constants/available-dicts.const'
import { IDictPreference } from './index.interface'
// import { PreferenceDoc } from '@/schemas/preference.schema'

/** Stores user preference for  */
export class DictPreferenceDomain {
  private readonly props: Partial<IDictPreference>

  private constructor(
    props: Partial<Omit<IDictPreference, 'availableDictCodes'>>,
  ) {
    this.props = props
    this.props.availableDictCodes = availableDictCodes
  }

  static getDefault() {
    return new DictPreferenceDomain({})
  }
  // static async fromDocs() // docs: PreferenceDoc
  // : Promise<DictPreferenceDomain> {
  //   return this.getDefault()
  // }

  toResDTO(): IDictPreference {
    return {
      availableDictCodes: this.props.availableDictCodes,
    }
  }
}
