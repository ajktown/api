import { PostWordReqDTO } from '@/dto/post-word.req-dto'
import { getEnvLambda, SupportedEnvAttr } from '@/lambdas/get-env.lambda'
import { Injectable } from '@nestjs/common'
import { Configuration, OpenAIApi } from 'openai'

enum PrivateOpenaiModel {
  TextDavinci003 = 'text-davinci-003',
}

@Injectable()
export class ChatGptService {
  private prepareOpenai() {
    const apiKey = getEnvLambda(SupportedEnvAttr.OpenAiKey)
    if (!apiKey) throw new Error('Open AI API Key not found on env file')

    return new OpenAIApi(
      new Configuration({
        apiKey,
      }),
    )
  }

  private generateSentencePrompt(term: string) {
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

  async getExampleSentenceByPostWordDto(
    postWordDto: PostWordReqDTO,
  ): Promise<string> {
    const openai = this.prepareOpenai()
    const completion = await openai.createCompletion({
      model: PrivateOpenaiModel.TextDavinci003,
      prompt: this.generateSentencePrompt(postWordDto.term),
      temperature: 0.6, // 0 ~ 1
      // user, TODO: ChatGPT offers abuse model 
    })

    return completion.data.choices[0].text.trim()
  }
}
