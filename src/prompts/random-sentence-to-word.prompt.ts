import { IWord } from '@/domains/word/index.interface'
import { Injectable } from '@nestjs/common'
import { PromptRoot } from './index.root'

enum PrivateType {
  FullSentence = `full-sentence`,
  Term = `term`,
}
@Injectable()
export class RandomSampleToWordPrompt extends PromptRoot {
  private async get(randomSample: string): Promise<string> {
    // TODO: This chat gpt does not return really well.
    return this.execute({
      command: `Return a dollar sign($) separated, ordered in type, ${PrivateType.Term} meaning, ${PrivateType.FullSentence} with the given "Random sample".`,
      extraRequests: [
        `the "Type" defines what kind of the random sample is. It could be ${PrivateType.Term} or ${PrivateType.FullSentence}.`,
        `If the type is ${PrivateType.FullSentence}, extract the hardest term.`,
        `Leave blank string if the type matches to the returning`,
        `The random sample also cloud be just a single term. In that case, use that term for the meaning and generate a simple sentence.`,
        `Meaning must be returned in the easiest manner`,
        `Answer it in the random sample's language`,
      ],
      reqHeader: `Random sample`,
      samples: [
        {
          req: `Xi and Putin end initial meeting in Moscow, affirm ties amid Ukraine war`,
          res: `${PrivateType.FullSentence}$affirm$to strongly state or assert something as true$`,
        },
        {
          req: `Fate of First Republic Uncertain as Shares Plummet Again`,
          res: `${PrivateType.FullSentence}$Plummet$to put into a lower position$`,
        },
        {
          req: `obstreperous`,
          res: `${PrivateType.Term}$$noisy and difficult to control.$the boy is cocky and obstreperous.`,
        },
        {
          req: `Netflix and chill`,
          res: `${PrivateType.Term}$$Wanna grab coffee in 21st expression.$Wanna netflix and chill?`,
        },
      ],
      mainRequestStr: randomSample,
    })
  }
  private getEmptyDefault(randomSample: string) {
    return {
      term: randomSample,
    }
  }
  async toIWord(randomSample: string): Promise<Partial<IWord>> {
    if (!this.isChatGptAllowed()) return this.getEmptyDefault(randomSample)

    const res = await this.get(randomSample)
    const splittedRes = res.split('$')
    if (splittedRes.length !== 4) throw new Error('Chat GPT Generated data is wrongful.')

    const [type, term, definition, example] = splittedRes

    return {
      term: type !== PrivateType.Term ? term : randomSample,
      definition,
      example: type !== PrivateType.FullSentence ? example : randomSample,
    }
  }
}
