import { IUser } from './index.interface'
import { TokenPayload } from 'google-auth-library'

export class UserDomain {
  private readonly props: Partial<IUser>

  private constructor(props: Partial<IUser>) {
    this.props = props
  }

  static fromGoogleAuthPayload(payload: TokenPayload) {
    return new UserDomain({
      federalID: payload.sub,
      email: payload.email,
      givenName: payload.given_name,
      familyName: payload.family_name,
    })
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

  toResDTO(): Partial<IUser> {
    return this.props
  }
}
