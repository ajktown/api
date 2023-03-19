import { Injectable } from '@nestjs/common'
import { PromptRoot } from './index.root'

@Injectable()
export class TermToExamplePrompt extends PromptRoot {
  get(term: string) {
    return this.buildString({
      command: `Suggest a simple example sentence with given term in American (New York, more specifically New York) English.
      If it seems like there are multiple terms, please choose the one that is the highest level.`,
      reqHeader: `Term`,
      samples: [
        {
          req: `Ambitious`,
          res: `I knew that the ambitious young man would make the world even better place.`,
        },
        {
          req: `Arduous`,
          res: `The work was arduous.`,
        },
      ],
      mainRequestStr: term[0].toUpperCase() + term.slice(1).toLowerCase(),
    })
  }
}
