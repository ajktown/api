import { ISemester } from './index.interface'

export class SemesterDomain {
  private readonly props: Partial<ISemester>

  private constructor(props: Partial<ISemester>) {
    this.props = props
  }

  // TODO: Probably not the best method to provide. Consider deleting it.
  static fromRaw(props: Partial<ISemester>) {
    return new SemesterDomain(props)
  }

  // static fromPostReqDto(dto: PostWordBodyDTO): WordDomain {
  //   return new WordDomain({
  //     languageCode: dto.languageCode,
  //     semester: dto.semester,
  //     isFavorite: dto.isFavorite,
  //     term: dto.term,
  //     pronunciation: dto.pronunciation,
  //     definition: dto.definition,
  //     example: dto.example,
  //     tags: dto.tags,
  //   })
  // }

  // static fromMdb(props: DeprecatedWordDocument): WordDomain {
  //   if (typeof props !== 'object') throw new Error('Not Object!')

  //   return new WordDomain({
  //     id: props.id,
  //     languageCode: props.language as GlobalLanguageCode, // TODO: Write a type validator
  //     semester: props.sem,
  //     isFavorite: props.isFavorite,
  //     term: props.word,
  //     pronunciation: props.pronun,
  //     definition: props.meaning,
  //     example: props.example,
  //     tags: props.tag,
  //     createdAt: new Date(props.createdAt),
  //     updatedAt: new Date(props.createdAt),
  //   })
  // }

  // toDocument(deprecatedWordModel: Model<DeprecatedWordDocument>) {
  //   const docProps: DeprecatedWordSchemaProps = {
  //     language: this.props.languageCode,
  //     sem: this.props.semester,
  //     isFavorite: this.props.isFavorite,
  //     word: this.props.term,
  //     pronun: this.props.pronunciation,
  //     meaning: this.props.definition,
  //     example: this.props.example,
  //     tag: this.props.tags,
  //     ownerID: 'abc',
  //     // Deprecated Props (Not used below from Wordnote, or Wordy v2):
  //     reviewdOn: [],
  //     order: 1,
  //     step: 1,
  //     isPublic: true,
  //     dateAdded: new Date().valueOf(),
  //   }
  //   return new deprecatedWordModel(docProps)
  // }

  toResDTO(): Partial<ISemester> {
    return this.props
  }
}
