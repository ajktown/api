import { PostWordReqDTO } from '@/dto/post-word.req-dto'
import { getEnvLambda, SupportedEnvAttr } from '@/lambdas/get-env.lambda'
import { TermToExamplePrompt } from '@/prompts/term-to-example.prompt'
import { Injectable } from '@nestjs/common'
import { Configuration, OpenAIApi } from 'openai'

enum PrivateOpenaiModel {
  TextDavinci003 = 'text-davinci-003',
}

@Injectable()
export class ChatGptService {
  constructor(private termToExamplePrompt: TermToExamplePrompt) {}

  private prepareOpenai() {
    const apiKey = getEnvLambda(SupportedEnvAttr.OpenAiKey)
    if (!apiKey) throw new Error('Open AI API Key not found on env file')

    return new OpenAIApi(
      new Configuration({
        apiKey,
      }),
    )
  }

  async getExampleSentenceByPostWordDto(
    postWordDto: PostWordReqDTO,
  ): Promise<string> {
    const openai = this.prepareOpenai()
    const completion = await openai.createCompletion({
      model: PrivateOpenaiModel.TextDavinci003,
      prompt: this.termToExamplePrompt.get(postWordDto.term),
      temperature: 0.6, // 0 ~ 1
      // user, TODO: ChatGPT offers abuse model. Apply with user id of the mongo db
    })

    return completion.data.choices[0].text.trim()
  }
}
