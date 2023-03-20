import { Injectable } from '@nestjs/common'
import { PromptRoot } from './index.root'

@Injectable()
export class TermToExamplePrompt extends PromptRoot {
  // TODO: I think this get function can be removed, and the rest of them goes as variable, and
  // TODO: Prompt root gets the data and return naturally.
  async get(term: string) {
    return this.execute({
      command: `Suggest a simple example sentence with given term in American English.`,
      extraRequests: [
        `If it seems like there are multiple terms, please choose the one that is the highest level.`,
      ],
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
