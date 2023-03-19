import { Injectable } from '@nestjs/common'

@Injectable()
export class TermToExamplePrompt {
  get(term: string) {
    const sentenceFormatTerm =
      term[0].toUpperCase() + term.slice(1).toLowerCase()
    return `Suggest a simple example sentence with given term in American (New York, more specifically New York) English.
      If it seems like there are multiple terms, please choose the one that is the highest level
      Term: Ambitious
      Simple Sentence: I knew that the ambitious young man would make the world even better place.
      Term: Arduous
      Simple Sentence: The work was arduous.
      Term: ${sentenceFormatTerm}
      Simple Sentence:`
  }
}
