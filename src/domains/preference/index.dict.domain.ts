import { availableDictCodes } from '@/constants/available-dicts.const'
import { IDictPreference } from './index.interface'
import { PreferenceDoc } from '@/schemas/preference.schema'
// import { PreferenceDoc } from '@/schemas/preference.schema'

/** Stores user preference for  */
export class DictPreferenceDomain {
  private readonly props: Partial<IDictPreference>

  private constructor(
    props: Partial<Omit<IDictPreference, 'availableDictCodes'>>,
  ) {
    this.props = props
    this.props.availableDictCodes = availableDictCodes
    this.props.selectedDictIds = props.selectedDictIds ?? ['google_en_en']
  }

  get selectedDictIds() {
    return this.props.selectedDictIds
  }

  static getDefault() {
    return new DictPreferenceDomain({})
  }

  static fromDoc(doc: PreferenceDoc): DictPreferenceDomain {
    return new DictPreferenceDomain({
      selectedDictIds: doc.selectedDictIds,
    })
  }

  toResDTO(): IDictPreference {
    return {
      selectedDictIds: this.props.selectedDictIds,
      availableDictCodes: this.props.availableDictCodes,
    }
  }
}
