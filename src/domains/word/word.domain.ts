import { IWord } from './index.interface'

// TODO: Write this domain in a standard format
// Doc: https://dev.to/bendix/applying-domain-driven-design-principles-to-a-nest-js-project-5f7b
export class WordDomain {
  constructor(props: IWord) {
    Object.assign(this, props)
  }
}
