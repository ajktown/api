import { InternalServerError } from '@/errors/500/index.error'
import { envLambda, SupportedEnvAttr } from '@/lambdas/get-env.lambda'
import { Configuration, OpenAIApi } from 'openai'

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
  TextDavinci003 = 'text-davinci-003',
}

export class PromptRoot {
  private prepareOpenai() {
    const apiKey = envLambda.get(SupportedEnvAttr.OpenAiKey)
    if (!apiKey)
      throw new InternalServerError('Open AI API Key not found on env file')

    return new OpenAIApi(
      new Configuration({
        apiKey,
      }),
    )
  }

  private buildPrompt(args: PrivateArgs) {
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

  protected async execute(args: PrivateArgs): Promise<string> {
    if (!envLambda.isChatGptAllowed()) return ''

    const openai = this.prepareOpenai()
    const completion = await openai.createCompletion({
      model: PrivateOpenaiModel.TextDavinci003,
      prompt: this.buildPrompt(args),
      temperature: 0.6, // 0 ~ 1
      // user, TODO: ChatGPT offers abuse model. Apply with user id of the mongo db
    })

    return completion.data.choices[0].text.trim()
  }
}
