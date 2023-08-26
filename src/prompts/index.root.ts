import { InternalServerError } from '@/errors/500/index.error'
import { envLambda, SupportedEnvAttr } from '@/lambdas/get-env.lambda'
import OpenAI from 'openai'

const PRIVATE_RES_HEADER = `Answer`

interface PrivateSample {
  req: string // sample questions
  res: string // expecting answer
}
interface PrivateArgs {
  command: string
  extraRequests: string[]
  reqHeader: string
  samples: PrivateSample[]
  mainRequestStr: string
}

enum PrivateOpenaiModel {
  TextDavinci003 = 'text-davinci-003', // Used since the beginning
  Gpt3_5Turbo = `gpt-3.5-turbo`, // Used since Aug 2023
}

export class PromptRoot {
  /** Prepares connection with OpenAI */
  private prepareOpenai() {
    const apiKey = envLambda.get(SupportedEnvAttr.OpenAiKey)
    if (!apiKey)
      throw new InternalServerError('Open AI API Key not found on env file')

    return new OpenAI({ apiKey })
  }

  /** Builds a request with given arguments */
  private buildContent(args: PrivateArgs): string {
    return `${args.command}
    ${args.extraRequests.map((request) => request).join('\n')}
    ${args.samples
      .map(
        (sample) =>
          `${args.reqHeader}: ${sample.req}\n${PRIVATE_RES_HEADER}: ${sample.res}`,
      )
      .join('\n')}
    ${args.reqHeader}: ${args.mainRequestStr}
    ${PRIVATE_RES_HEADER}:`
  }

  /** Returns OpenAI generated response */
  protected async execute(args: PrivateArgs): Promise<string> {
    if (!envLambda.isChatGptAllowed()) return ''

    const openai = this.prepareOpenai()
    const completion = await openai.chat.completions.create({
      messages: [{ role: 'user', content: this.buildContent(args) }],
      model: PrivateOpenaiModel.Gpt3_5Turbo,
      temperature: 0.6, // 0 ~ 1
    })

    return completion.choices[0].message.content
  }
}
