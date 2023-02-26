import { IWord } from "./index.interface"

// TODO: Write this domain in a standard format
export class WordDomain {
  constructor (props: IWord) {
    Object.assign(this, props)
  }
}