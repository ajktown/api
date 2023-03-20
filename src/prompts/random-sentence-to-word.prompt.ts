import { Injectable } from '@nestjs/common'
import { PromptRoot } from './index.root'

@Injectable()
export class RandomSampleToWordPrompt extends PromptRoot {
  async get(randomSample: string) {
    return this.execute({
      command: `Return a dollar sign($) separated, ordered in term, meaning, example sentence with the given "Random sample".`,
      extraRequests: [
        `The random sample could be full sentence.`,
        `If it is full sentence, extract the hardest term, use the given full sentence as example sentence.`,
        `The random sample also cloud be just a single term. In that case, use that term for the meaning and generate a simple sentence.`,
        `Meaning must be returned in the easiest manner`,
        `Answer it in the random sample's language`,
      ],
      reqHeader: `Random sample`,
      samples: [
        {
          req: `Fate of First Republic Uncertain as Shares Plummet Again`,
          res: `Plummet$to put into a lower position$Fate of First Republic Uncertain as Shares Plummet Again`,
        },
        {
          req: `obstreperous`,
          res: `obstreperous$noisy and difficult to control.$the boy is cocky and obstreperous.`,
        },
      ],
      mainRequestStr: randomSample,
    })
  }
}
